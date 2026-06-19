import Image from "next/image";
import { ChevronDown, ArrowRight } from "lucide-react";
import { MobileMenu } from "@/components/mobile-menu";
import {
  SITE,
  asset,
  NAV_REPAIR,
  NAV_INSTALL,
  NAV_DOORS,
  NAV_ABOUT,
  CITIES,
} from "@/lib/site";

const TRIGGER =
  "flex cursor-pointer items-center gap-1.5 border-none bg-transparent py-5 font-sans text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink group-hover:text-accent group-focus-within:text-accent";

const CARET = "h-[13px] w-[13px] transition-transform group-hover:rotate-180 group-focus-within:rotate-180";

const PANEL =
  "invisible absolute left-1/2 top-full z-[60] mt-3 -translate-x-1/2 translate-y-2.5 rounded-lg border-2 border-ink bg-white p-[22px] opacity-0 shadow-[0_26px_50px_rgba(0,0,0,0.22)] transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 before:absolute before:inset-x-0 before:-top-3.5 before:h-3.5 before:content-['']";

function MLink({ href, children, all }: { href: string; children: React.ReactNode; all?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-[7px] whitespace-nowrap rounded-md px-2.5 py-2 text-[14.5px] no-underline hover:bg-sand hover:text-accent ${
        all ? "font-extrabold text-accent" : "font-semibold text-[#3a3a3a]"
      }`}
    >
      {all && <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />}
      {children}
    </a>
  );
}

function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border-b-[3px] border-accent pb-1.5 font-heading text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-ink">
      {children}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-white">
      <div className="relative mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-8 py-3">
        <a href="/" aria-label="Trinity Garage Door Service, Home">
          <Image
            src={asset("logo-trinity-primary.png")}
            alt="Trinity Garage Door Service"
            width={220}
            height={60}
            priority
            className="h-[60px] w-auto"
          />
        </a>

        <nav className="hidden items-center gap-7 min-[921px]:flex">
          {/* Services */}
          <div className="group static flex items-center">
            <button type="button" className={TRIGGER} aria-haspopup="true">
              Services <ChevronDown className={CARET} strokeWidth={2.6} />
            </button>
            <div className={`${PANEL} grid w-[700px] grid-cols-[1.1fr_1fr_1fr] gap-3.5`}>
              <div className="rounded-lg border border-[#f0dcdc] bg-[#fbf3f3] p-3.5">
                <ColHeader>Repair</ColHeader>
                {NAV_REPAIR.map((l) => (
                  <MLink key={l.href} href={l.href}>{l.label}</MLink>
                ))}
                <MLink href="/services/repair/" all>All Repair Services</MLink>
                <a href={SITE.bookingHref} className="mt-2 flex items-center justify-center gap-2 rounded-[7px] bg-accent px-3.5 py-[11px] text-[13px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">
                  Book a Repair
                </a>
              </div>
              <div className="px-1 py-3.5">
                <ColHeader>Install &amp; Replace</ColHeader>
                {NAV_INSTALL.map((l) => (
                  <MLink key={l.href} href={l.href}>{l.label}</MLink>
                ))}
                <a href="/get-service/?intent=estimate" className="mt-2 flex items-center justify-center gap-2 rounded-[7px] border-2 border-ink bg-white px-3.5 py-[11px] text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
                  Free Estimate
                </a>
              </div>
              <div className="px-1 py-3.5">
                <ColHeader>Doors &amp; Brands</ColHeader>
                {NAV_DOORS.map((l) => (
                  <MLink key={l.href} href={l.href}>{l.label}</MLink>
                ))}
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="group static flex items-center">
            <button type="button" className={TRIGGER} aria-haspopup="true">
              Service Areas <ChevronDown className={CARET} strokeWidth={2.6} />
            </button>
            <div className={`${PANEL} w-[260px]`}>
              <ColHeader>Areas</ColHeader>
              {CITIES.map((c) => (
                <MLink key={c.slug} href={`/service-areas/${c.slug}/`}>{c.name}</MLink>
              ))}
              <MLink href="/service-areas/" all>All Service Areas</MLink>
            </div>
          </div>

          {/* About */}
          <div className="group static flex items-center">
            <button type="button" className={TRIGGER} aria-haspopup="true">
              About <ChevronDown className={CARET} strokeWidth={2.6} />
            </button>
            <div className={`${PANEL} w-[240px]`}>
              <ColHeader>About</ColHeader>
              {NAV_ABOUT.map((l) => (
                <MLink key={l.href} href={l.href}>{l.label}</MLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <a href={SITE.phoneHref} className="hidden whitespace-nowrap text-[17px] font-black text-ink no-underline min-[921px]:inline">
            {SITE.phoneDisplay}
          </a>
          <a href={SITE.bookingHref} className="hidden rounded-[7px] bg-accent px-[22px] py-[13px] text-[13.5px] font-extrabold uppercase tracking-[0.04em] text-white no-underline min-[921px]:inline-block">
            Book a Repair
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
