"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import {
  SITE,
  NAV_REPAIR,
  NAV_INSTALL,
  NAV_DOORS,
  NAV_ABOUT,
  CITIES,
} from "@/lib/site";

const AREA_LINKS = CITIES.map((c) => ({ label: c.name, href: `/service-areas/${c.slug}/` }));

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>("services");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = (key: string) => setSection((s) => (s === key ? null : key));

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-[7px] border-2 border-ink p-2 min-[921px]:hidden"
      >
        <Menu className="h-[22px] w-[22px] text-ink" strokeWidth={2.4} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white min-[921px]:hidden">
          <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3.5">
            <span className="font-heading text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-[7px] border-2 border-ink p-2"
            >
              <X className="h-[22px] w-[22px] text-ink" strokeWidth={2.4} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            {/* Services */}
            <Accordion label="Services" open={section === "services"} onToggle={() => toggle("services")}>
              <Group title="Repair" links={[...NAV_REPAIR, { label: "All Repair Services", href: "/services/repair/" }]} onNav={() => setOpen(false)} />
              <Group title="Install & Replace" links={NAV_INSTALL} onNav={() => setOpen(false)} />
              <Group title="Doors & Brands" links={NAV_DOORS} onNav={() => setOpen(false)} />
            </Accordion>

            {/* Service Areas */}
            <Accordion label="Service Areas" open={section === "areas"} onToggle={() => toggle("areas")}>
              <Group links={[...AREA_LINKS, { label: "All Service Areas", href: "/service-areas/" }]} onNav={() => setOpen(false)} />
            </Accordion>

            {/* About */}
            <Accordion label="About" open={section === "about"} onToggle={() => toggle("about")}>
              <Group links={NAV_ABOUT} onNav={() => setOpen(false)} />
            </Accordion>
          </nav>

          <div className="flex flex-col gap-2.5 border-t-2 border-ink p-5">
            <a
              href={SITE.phoneHref}
              className="flex items-center justify-center gap-2 rounded-[7px] border-2 border-ink py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline"
            >
              <Phone className="h-[17px] w-[17px] text-accent" strokeWidth={2.2} />
              Call {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.bookingHref}
              onClick={() => setOpen(false)}
              className="rounded-[7px] bg-accent py-3.5 text-center text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
            >
              Book a Repair
            </a>
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
        className="flex w-full items-center justify-between py-4 font-heading text-[16px] font-extrabold uppercase tracking-[0.03em] text-ink"
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
          <a
            key={l.label}
            href={l.href}
            onClick={onNav}
            className="py-2 text-[15px] font-semibold text-[#3a3a3a] no-underline"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
