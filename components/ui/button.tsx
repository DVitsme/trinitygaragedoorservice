import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Bold Trade CTA styling, shared by the link (`Cta`) and `<button>` (`Button`). */
export const ctaVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-[7px] font-extrabold uppercase tracking-[0.04em] no-underline transition-colors disabled:opacity-60",
  {
    variants: {
      variant: {
        accent: "bg-accent text-white",
        light: "bg-white text-ink",
        outline: "border-2 border-ink text-ink",
        outlineLight: "border-2 border-white text-white",
        dark: "bg-ink text-white",
      },
      size: {
        md: "px-[22px] py-[13px] text-[13.5px]",
        lg: "px-8 py-[17px] text-[15px]",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "accent", size: "md" },
  },
);

type CtaVariantProps = VariantProps<typeof ctaVariants>;

/** A styled link CTA (most "Book a Repair" / "Call" buttons are links). */
export function Cta({
  variant,
  size,
  full,
  className,
  ...props
}: CtaVariantProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(ctaVariants({ variant, size, full }), className)} {...props} />;
}

/** A styled `<button>` (form submits, toggles). */
export function Button({
  variant,
  size,
  full,
  className,
  ...props
}: CtaVariantProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(ctaVariants({ variant, size, full }), className)} {...props} />;
}
