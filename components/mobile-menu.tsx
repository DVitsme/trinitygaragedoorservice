"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import {
  SITE,
  ROUTES,
  getNavConfig,
  NAV_REPAIR,
  NAV_INSTALL,
  NAV_DOORS,
  NAV_ABOUT,
  AREAS,
} from "@/lib/site";

const AREA_LINKS = AREAS.map((c) => ({ label: c.name, href: `/service-areas/${c.slug}/` }));

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>("services");
  const cfg = getNavConfig(usePathname() || "/");
  const estimate = cfg.headerCta === "estimate";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = (key: string) => setSection((s) => (s === key ? null : key));
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-[7px] border-2 border-ink p-2 nav:hidden"
      >
        <Menu className="h-[22px] w-[22px] text-ink" strokeWidth={2.4} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white nav:hidden">
          <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3.5">
            <span className="font-display text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="flex items-center justify-center rounded-[7px] border-2 border-ink p-2"
            >
              <X className="h-[22px] w-[22px] text-ink" strokeWidth={2.4} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
            <Accordion label="Services" open={section === "services"} onToggle={() => toggle("services")}>
              <Group title="Repair" links={[...NAV_REPAIR, { label: "All Repair Services", href: ROUTES.repair }]} onNav={close} />
              <Group title="Install & Replace" links={NAV_INSTALL} onNav={close} />
              <Group title="Doors & Brands" links={NAV_DOORS} onNav={close} />
            </Accordion>

            <Accordion label="Service Areas" open={section === "areas"} onToggle={() => toggle("areas")}>
              <Group links={[...AREA_LINKS, { label: "All Service Areas", href: ROUTES.serviceAreas }]} onNav={close} />
            </Accordion>

            <Accordion label="About" open={section === "about"} onToggle={() => toggle("about")}>
              <Group links={NAV_ABOUT} onNav={close} />
            </Accordion>

            <Link
              href={ROUTES.contact}
              onClick={close}
              className="flex w-full items-center justify-between border-b border-[#e3e0da] py-4 font-display text-[16px] font-extrabold uppercase tracking-[0.03em] text-ink no-underline"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col gap-2.5 border-t-2 border-ink p-5">
            <a
              href={SITE.phoneHref}
              className="flex items-center justify-center gap-2 rounded-[7px] border-2 border-ink py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline"
            >
              <Phone className="h-[17px] w-[17px] text-accent" strokeWidth={2.2} />
              Call {SITE.phoneDisplay}
            </a>
            <Link
              href={estimate ? ROUTES.estimate : ROUTES.getStarted}
              onClick={close}
              className="rounded-[7px] bg-accent py-3.5 text-center text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
            >
              {estimate ? "Free Estimate" : "Get Started"}
              <span className="sr-only">{estimate ? " for a free estimate" : " with a garage door repair"}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function Accordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#e3e0da]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 font-display text-[16px] font-extrabold uppercase tracking-[0.03em] text-ink"
      >
        {label}
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.4} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function Group({
  title,
  links,
  onNav,
}: {
  title?: string;
  links: readonly { label: string; href: string }[];
  onNav: () => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      {title && (
        <div className="mb-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-accent">
          {title}
        </div>
      )}
      <div className="flex flex-col">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={onNav}
            className="py-2 text-[15px] font-semibold text-[#3a3a3a] no-underline"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
