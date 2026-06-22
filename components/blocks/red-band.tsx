import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Cta } from "./primitives";

/**
 * Full-width red emphasis band (handoff 02). `split` = left text + right white phone
 * card (mid-page emphasis); `center` = centered closing CTA on most pages.
 */
export function RedBand({
  eyebrow,
  title,
  lead,
  variant = "split",
  phoneCard = true,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  variant?: "split" | "center";
  phoneCard?: boolean;
  children?: ReactNode;
}) {
  if (variant === "center") {
    return (
      <section className="bg-accent text-white">
        <div className="mx-auto max-w-[860px] px-5 py-[72px] text-center nav:px-8">
          {eyebrow && (
            <div className="mb-3 inline-block rounded-full bg-[rgba(0,0,0,0.18)] px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em]">{eyebrow}</div>
          )}
          <h2 className="m-0 font-display text-[clamp(26px,3.6vw,42px)] font-extrabold uppercase leading-[1.04]">{title}</h2>
          {lead && <p className="mx-auto mt-4 max-w-[620px] text-[17px] leading-[1.55] text-white/90">{lead}</p>}
          {children && <div className="mt-7 flex flex-wrap justify-center gap-3.5">{children}</div>}
        </div>
      </section>
    );
  }
  return (
    <section className="bg-accent text-white">
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 py-[60px] nav:grid-cols-[1.2fr_1fr] nav:px-8">
        <div>
          {eyebrow && (
            <div className="mb-3 inline-block rounded-full bg-[rgba(0,0,0,0.18)] px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em]">{eyebrow}</div>
          )}
          <h2 className="m-0 font-display text-[clamp(24px,3.2vw,38px)] font-extrabold uppercase leading-[1.05]">{title}</h2>
          {lead && <p className="mt-4 max-w-[560px] text-[17px] leading-[1.55] text-white/90">{lead}</p>}
          {children && <div className="mt-6 flex flex-wrap gap-3.5">{children}</div>}
        </div>
        {phoneCard && (
          <div className="rounded-[10px] border-2 border-white bg-white p-7 text-center text-ink">
            <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-accent">Call us 24/7</div>
            <a href={SITE.phoneHref} className="mt-2 block font-display text-[clamp(26px,4vw,34px)] font-black text-ink no-underline">{SITE.phoneDisplay}</a>
            <Cta href={SITE.phoneHref} variant="accent" size="lg" full className="mt-4">
              <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} /> Call Now
            </Cta>
          </div>
        )}
      </div>
    </section>
  );
}
