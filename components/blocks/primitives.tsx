import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Section band + container (handoff 01 spacing). bg alternates white -> cream -> ink. */
const BG = {
  white: "bg-white text-ink",
  cream: "bg-cream text-ink",
  ink: "bg-ink text-white",
  accent: "bg-accent text-white",
} as const;

export function Section({
  bg = "white",
  topRule,
  id,
  className,
  innerClassName,
  children,
}: {
  bg?: keyof typeof BG;
  topRule?: "ink" | "accent";
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const rule = topRule === "ink" ? "border-t-2 border-ink" : topRule === "accent" ? "border-t-[5px] border-accent" : "";
  return (
    <section id={id} className={cn(BG[bg], rule, className)}>
      <div className={cn("mx-auto max-w-[1200px] px-5 py-[60px] nav:px-8 nav:py-[88px]", innerClassName)}>{children}</div>
    </section>
  );
}

/** Eyebrow (accent, 30x3 red bar) + uppercase H2 + optional intro (handoff 01/02). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-[760px] text-center", className)}>
      {eyebrow && (
        <div className={cn("flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent", align === "center" && "justify-center")}>
          <span className="h-[3px] w-[30px] bg-accent" />
          {eyebrow}
        </div>
      )}
      <h2 className={cn("m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]", dark ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-[16.5px] leading-[1.6]", dark ? "text-[#a8a8a8]" : "text-body", align === "center" && "mx-auto max-w-[680px]")}>{intro}</p>
      )}
    </div>
  );
}

/* CTA button styling (handoff 01). Shared by link (`Cta`) and `<button>` (`Button`). */
export const ctaVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-[7px] font-extrabold uppercase tracking-[0.04em] no-underline transition-colors disabled:opacity-60",
  {
    variants: {
      variant: {
        accent: "bg-accent text-white shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark",
        light: "bg-white text-ink border-2 border-ink hover:border-accent hover:text-accent",
        dark: "bg-ink text-white hover:bg-black",
        outlineLight: "border-2 border-white text-white hover:bg-white hover:text-ink",
        onRed: "bg-white text-accent hover:bg-cream",
      },
      size: {
        sm: "px-[22px] py-[13px] text-[13.5px]",
        lg: "px-8 py-[17px] text-[15px]",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "accent", size: "lg" },
  },
);
type CtaVP = VariantProps<typeof ctaVariants>;

export function Cta({
  variant,
  size,
  full,
  className,
  href,
  children,
  ...rest
}: CtaVP & { href: string; children?: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(ctaVariants({ variant, size, full }), className);
  if (href.startsWith("/")) return <Link href={href} className={cls} {...rest}>{children}</Link>;
  return <a href={href} className={cls} {...rest}>{children}</a>;
}

export function Button({ variant, size, full, className, ...props }: CtaVP & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(ctaVariants({ variant, size, full }), className)} {...props} />;
}

/** Breadcrumb row (handoff G6 BreadcrumbList feeds this). */
export function Breadcrumb({ items, onDark = true }: { items: { label: string; href?: string }[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 text-[13px] font-semibold", onDark ? "text-white/70" : "text-body")}>
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.href ? (
            <Link href={it.href} className="no-underline hover:text-accent">{it.label}</Link>
          ) : (
            <span className={onDark ? "text-white" : "text-ink"}>{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
        </span>
      ))}
    </nav>
  );
}
