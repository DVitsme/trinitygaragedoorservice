import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-[#8a8a8a]">
      {items.map((it, i) => (
        <span key={`${it.label}-${i}`} className="inline-flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
          {it.href ? (
            <a href={it.href} className="no-underline hover:text-accent">
              {it.label}
            </a>
          ) : (
            <span className="text-ink" aria-current="page">
              {it.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
