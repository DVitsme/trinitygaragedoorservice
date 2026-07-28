/**
 * Blog accessors.
 *
 * The posts are parsed at BUILD time by scripts/generate-blog.mjs, which writes blog-data.json.
 * This module only imports that JSON, so nothing here touches the filesystem or a markdown
 * parser at runtime.
 *
 * That matters on Cloudflare Workers: reading content/blog with `fs` from the app made every
 * blog route return 500 and the sitemap come back empty, because OpenNext loads the route module
 * in the server function and content/blog is not part of the Worker bundle.
 *
 * To change how posts are parsed or normalized, edit scripts/generate-blog.mjs, not this file.
 */
import data from "./blog-data.json";

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

const posts = data as BlogPost[];

/** All published posts, newest first (ordering is baked in by the generator). */
export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Categories with counts, most used first, for the index filter rail. */
export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
