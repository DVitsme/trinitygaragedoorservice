#!/usr/bin/env node
/**
 * Build-time blog generator. Reads content/blog/*.md and writes lib/blog-data.json.
 *
 * WHY THIS EXISTS: reading the markdown with `fs` from inside the app fails on Cloudflare
 * Workers. Even though every blog route is statically generated, OpenNext still loads the route
 * module in the server function, and `content/blog/` is not part of the Worker bundle, so the
 * pages 500 and the sitemap comes back empty. Baking the parsed posts into a JSON module removes
 * all filesystem and markdown-parsing work from the runtime bundle.
 *
 * Runs from the `build` script, ahead of `next build`.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const OUT = path.join(ROOT, "lib", "blog-data.json");

/** Alt text for the 13 featured images: every source `featuredImageAlt` is an empty string. */
const IMAGE_ALT = {
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
 * Expired promotional sections to remove, keyed by slug. Each value is the heading text that
 * opens the block; everything to the next same-or-higher-level heading is dropped. These carry
 * hard prices and dated offers that would otherwise publish as current.
 */
const EXPIRED_PROMO_HEADINGS = {
  "december-in-florida-garage-door": ["About Those Specials (Yes, This Is the Right Time)"],
  "dont-let-your-garage-door-be-the-weak-link-this-hurricane-season": [
    "August Special: Prepare Now and Save",
  ],
};

function stripSection(md, headingText) {
  const lines = md.split("\n");
  const startIdx = lines.findIndex(
    (l) => /^#{2,6}\s/.test(l) && l.replace(/^#+\s*/, "").trim() === headingText,
  );
  if (startIdx === -1) return md;
  const startLevel = (lines[startIdx].match(/^#+/) ?? ["##"])[0].length;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,6})\s/);
    if (m && m[1].length <= startLevel) { endIdx = i; break; }
  }
  return [...lines.slice(0, startIdx), ...lines.slice(endIdx)].join("\n");
}

/** Repair the WordPress capture damage. Order matters: promotions happen before the level remap. */
function normalize(raw, slug, title) {
  let md = raw;
  for (const heading of EXPIRED_PROMO_HEADINGS[slug] ?? []) md = stripSection(md, heading);
  md = md.replace(/^\(In-body links:.*$/gm, "");
  md = md.replace(
    new RegExp(`^#{2,6}\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m"),
    "",
  );
  md = md.replace(/^[•]\s*/gm, "- ");
  md = md.replace(/^(?:✅|\u{1F449})\s*/gmu, "");
  md = md.replace(/^\*\*(\d+\.\s+[^*]+?)\*\*\s*$/gm, "### $1");
  md = md.replace(/^(#{3,6})(\s)/gm, (_m, hashes, space) =>
    "#".repeat(Math.max(2, hashes.length - 1)) + space,
  );
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

function deriveExcerpt(md, max = 165) {
  const para = md.split("\n").find(
    (l) => l.trim() && !/^[#>\-*|]/.test(l.trim()) && !/^!\[/.test(l.trim()),
  );
  if (!para) return "";
  const plain = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, plain.lastIndexOf(" ", max)).replace(/[,;:]$/, "") + "...";
}

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

function formatDate(date) {
  const [y, m] = String(date).split("-");
  const idx = Number(m) - 1;
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : String(date);
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && f !== "README.md");

const posts = files.flatMap((file) => {
  const parsed = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
  const fm = parsed.data;
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
    html: marked.parse(md, { async: false }),
  }];
});

posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

fs.writeFileSync(OUT, JSON.stringify(posts, null, 2) + "\n");
console.log(`[generate-blog] wrote ${posts.length} posts -> ${path.relative(ROOT, OUT)}`);
