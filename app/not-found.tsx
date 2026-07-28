import type { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found | Trinity Garage Door Service",
  description: "That page has moved or no longer exists. Find garage door repair, installation, and service across Tampa Bay, or call (813) 279-6785.",
  robots: { index: false, follow: true },
};

/**
 * Branded 404. Worth real design here: the legacy WordPress 301 map cannot cover every old URL,
 * so inbound links from search and old business cards will land on this page.
 */
const HELP = [
  { href: ROUTES.repair, title: "Garage Door Repair", desc: "Springs, cables, rollers, tracks, and openers." },
  { href: ROUTES.bookRepair, title: "Book a Repair", desc: "Pick a time online and we will be there." },
  { href: ROUTES.services, title: "All Services", desc: "Repair, installation, and replacement." },
  { href: ROUTES.serviceAreas, title: "Service Areas", desc: "The six Tampa Bay cities we cover." },
  { href: ROUTES.blog, title: "Advice & Resources", desc: "FAQ, safety tips, and troubleshooting." },
  { href: ROUTES.contact, title: "Contact Us", desc: "Free estimates, no obligation." },
];

export default function NotFound() {
  return (
    <>
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[96px]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 28%, rgba(184,32,42,0.3), transparent 50%)" }} />
        <div className="relative z-[2] mx-auto max-w-[860px] text-center">
          <div className="font-display text-[clamp(64px,12vw,132px)] font-black uppercase leading-none text-accent-on-dark [text-shadow:0_2px_30px_rgba(0,0,0,0.55)]">404</div>
          <h1 className="m-0 mt-3 font-display text-[clamp(26px,4.2vw,44px)] font-black uppercase leading-[1.02] tracking-[-0.015em] text-white">
            This Door <span className="inline-block bg-accent px-3 text-white">Won&apos;t Open</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[17.5px] font-medium leading-[1.55] text-white/90">
            The page you were after has moved or is no longer here. Nothing is broken on your end. Try one of the links below, or just call us and we&apos;ll point you the right way.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-[13px]">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-accent-dark">
              <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
            </a>
            <Link href={ROUTES.home} className="rounded-[7px] border-2 border-white/30 px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">Back to Home</Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[72px] nav:px-8">
          <h2 className="m-0 text-center font-display text-[clamp(20px,2.6vw,28px)] font-extrabold uppercase leading-[1.05] text-ink">Where Were You Headed?</h2>
          <div className="mt-8 grid gap-4 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
            {HELP.map((h) => (
              <Link key={h.href} href={h.href} className="group flex items-start justify-between gap-3 rounded-[8px] border-2 border-ink bg-white p-[18px_20px] no-underline transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_14px_28px_rgba(0,0,0,0.13)]">
                <span>
                  <span className="block font-display text-[15px] font-extrabold uppercase text-ink">{h.title}</span>
                  <span className="mt-1 block text-[14px] leading-[1.5] text-body">{h.desc}</span>
                </span>
                <ArrowRight className="mt-0.5 h-[18px] w-[18px] flex-none text-accent transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
