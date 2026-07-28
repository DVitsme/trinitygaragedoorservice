/**
 * Blog content pipeline. Reads `content/blog/*.md` at BUILD time only (every blog route is
 * statically generated), so no filesystem access happens in the Cloudflare Worker at runtime.
 *
 * The 13 posts are the client's own WordPress content, migrated verbatim. Verbatim is the rule,
 * so prose is NOT rewritten here. The normalizers below only repair capture/formatting damage
 * and remove expired promotional offers (stale prices must not ship as if current).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  /** Raw frontmatter value, "YYYY-MM". Dates are approximate (inferred from WP upload paths). */
  date: string;
  /** Human label, e.g. "March 2026". Month precision only until real dates are confirmed. */
  dateLabel: string;
  dateApprox: boolean;
  category: string;
  featuredImage: string;
  featuredImageAlt: string;
  excerpt: string;
  html: string;
};

/**
 * Alt text for the 13 featured images. Every `featuredImageAlt` in the source frontmatter is an
 * empty string (flagged in content/blog/README.md), so it is authored here rather than shipping
 * 13 undescribed images.
 */
const IMAGE_ALT: Record<string, string> = {
  "why-garage-door-springs-break-more-often-in-florida":
    "A coiled garage door torsion spring showing wear",
  "floridas-february-temperature-swings-and-your-garage-door-why-your-springs-matter-more-than-you-think":
    "A residential garage door on a bright Florida winter morning",
  "what-those-garage-door-noises-actually-mean":
    "A garage door opener unit mounted to a garage ceiling",
  "december-in-florida-garage-door": "A home garage decorated for the holidays",
  "holiday-ready-homes-time-to-tune-up-your-garage-door":
    "A tidy two car garage door on a suburban home",
  "what-that-strange-garage-door-noise-really-means-and-no-its-not-a-goblin":
    "A dimly lit garage interior at night",
  "top-3-mistakes-homeowners-make-when-preparing-garage-doors-for-storms":
    "Storm clouds gathering over a Florida neighborhood",
  "dont-let-your-garage-door-be-the-weak-link-this-hurricane-season":
    "A garage door braced against high wind during storm season",
  "why-routine-garage-door-maintenance-matters-more-during-storm-season":
    "A technician servicing garage door hardware",
  "is-your-garage-door-hurricane-ready-5-signs-its-time-for-an-upgrade":
    "A wind rated garage door on a Florida home",
  "how-a-new-garage-door-can-boost-your-homes-curb-appeal":
    "A new carriage style garage door on a well kept home",
  "professional-garage-door-repair-services-in-lutz":
    "A Trinity technician repairing a garage door in Lutz",
  "understanding-garage-doors-and-garage-door-repair":
    "Garage door tracks, rollers, and spring hardware",
};

/**
 * Expired promotional sections to remove, keyed by slug. Each entry is the exact heading text that
 * opens the block; everything up to the next heading of the same or higher level is dropped.
 * These carry hard prices and dated offers ("August Special", "$100 off") that would otherwise go
 * live as current. Client decision 2026-07-27: strip the offer, keep the article.
 */
const EXPIRED_PROMO_HEADINGS: Record<string, string[]> = {
  "december-in-florida-garage-door": ["About Those Specials (Yes, This Is the Right Time)"],
  "dont-let-your-garage-door-be-the-weak-link-this-hurricane-season": [
    "August Special: Prepare Now and Save",
  ],
};

/** Remove a markdown section: its heading line through to the next same-or-higher-level heading. */
function stripSection(md: string, headingText: string): string {
  const lines = md.split("\n");
  const startIdx = lines.findIndex(
    (l) => /^#{2,6}\s/.test(l) && l.replace(/^#+\s*/, "").trim() === headingText,
  );
  if (startIdx === -1) return md;

  const startLevel = (lines[startIdx].match(/^#+/) ?? ["##"])[0].length;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,6})\s/);
    if (m && m[1].length <= startLevel) {
      endIdx = i;
      break;
    }
  }
  return [...lines.slice(0, startIdx), ...lines.slice(endIdx)].join("\n");
}

/**
 * Repair the formatting damage carried over from the WordPress capture. Ordering matters:
 * structural promotions happen before the heading level remap so everything shifts together.
 */
function normalize(raw: string, slug: string, title: string): string {
  let md = raw;

  // 1. Drop expired promotional sections (hard prices / dated offers).
  for (const heading of EXPIRED_PROMO_HEADINGS[slug] ?? []) {
    md = stripSection(md, heading);
  }

  // 2. Remove the leftover capture artifact noting where in-body links used to point.
  md = md.replace(/^\(In-body links:.*$/gm, "");

  // 3. Two posts open with a heading that just repeats the title, which would duplicate the H1.
  md = md.replace(
    new RegExp(`^#{2,6}\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m"),
    "",
  );

  // 4. One post uses the literal bullet character instead of markdown list syntax.
  md = md.replace(/^[•]\s*/gm, "- ");

  // 5. Emoji used as list markers / CTA prefixes; keep the sentence, drop the glyph.
  md = md.replace(/^(?:✅|\u{1F449})\s*/gmu, "");

  // 6. One post has no headings at all: its five "signs" are bold-only lines. Promote them so the
  //    page has a real outline instead of rendering as an undifferentiated wall of text.
  md = md.replace(/^\*\*(\d+\.\s+[^*]+?)\*\*\s*$/gm, "### $1");

  // 7. Bodies start at H3 (a WordPress artifact). The page supplies the H1, so lift every heading
  //    one level: ### -> ##, #### -> ###. Without this the outline skips a level.
  md = md.replace(/^(#{3,6})(\s)/gm, (_m, hashes: string, space: string) =>
    "#".repeat(Math.max(2, hashes.length - 1)) + space,
  );

  return md.replace(/\n{3,}/g, "\n\n").trim();
}

/** First real paragraph, stripped of markdown, for cards and meta descriptions. */
function deriveExcerpt(md: string, max = 165): string {
  const para = md
    .split("\n")
    .find((l) => l.trim() && !/^[#>\-*|]/.test(l.trim()) && !/^!\[/.test(l.trim()));
  if (!para) return "";
  const plain = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, plain.lastIndexOf(" ", max)).replace(/[,;:]$/, "") + "...";
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-03" -> "March 2026". Month precision only; dates are approximate. */
function formatDate(date: string): string {
  const [y, m] = date.split("-");
  const idx = Number(m) - 1;
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : date;
}

let cache: BlogPost[] | null = null;

/** All published posts, newest first. Ties break on title so ordering is stable across builds. */
export function getAllPosts(): BlogPost[] {
  if (cache) return cache;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && f !== "README.md");

  const posts = files.flatMap((file): BlogPost[] => {
    const parsed = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
    const fm = parsed.data as Record<string, unknown>;
    if (fm.status && fm.status !== "published") return [];

    const slug = String(fm.slug ?? file.replace(/\.md$/, ""));
    const title = String(fm.title ?? slug);
    const date = String(fm.date ?? "");
    const md = normalize(parsed.content, slug, title);

    return [{
      slug,
      title,
      date,
      dateLabel: formatDate(date),
      dateApprox: fm.dateApprox === true,
      category: String(fm.category ?? "Garage Doors"),
      featuredImage: String(fm.featuredImage ?? ""),
      featuredImageAlt: IMAGE_ALT[slug] ?? `Illustration for ${title}`,
      excerpt: deriveExcerpt(md),
      html: marked.parse(md, { async: false }) as string,
    }];
  });

  cache = posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  return cache;
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Categories with counts, most used first, for the index filter rail. */
export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
