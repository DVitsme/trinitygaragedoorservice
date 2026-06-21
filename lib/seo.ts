import type { Metadata } from "next";
import { SITE } from "./site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trinity-garage-bold-trade.pages.dev";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

/** Build per-page metadata (title, description, canonical, OpenGraph) for inner pages. */
export function pageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, type: "website" },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
