import Image from "next/image";
import { InstagramIcon } from "@/components/social-icons";
import { SITE, asset } from "@/lib/site";

const FOOTER_SERVICES = [
  { label: "Emergency Repair", href: "/services/repair/emergency/" },
  { label: "Spring Repair", href: "/services/repair/spring/" },
  { label: "Opener Repair", href: "/services/repair/opener/" },
  { label: "Installation", href: "/services/installation/" },
];

const FOOTER_RESOURCES = [
  { label: "Blog", href: "/resources/blog/" },
  { label: "Safety Tips", href: "/resources/safety-tips/" },
  { label: "DIY Troubleshooting", href: "/resources/troubleshooting/" },
  { label: "FAQ", href: "/resources/faq/" },
];

/**
 * Only profiles we have a real URL for are rendered. Facebook, LinkedIn, Yelp, and Google
 * previously shipped as `href="#"`, which put four dead links on every page of the site and
 * broke the project's no-dead-links rule (handoff F2).
 *
 * TODO(client): add the real Facebook, Yelp, and Google Business Profile URLs here. The icons
 * are already built in components/social-icons.tsx, so each is a one line addition.
 */
const SOCIALS = [
  { Icon: InstagramIcon, label: "Instagram", href: SITE.instagram },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#111] text-[#9a9a9a]">
      <div className="mx-auto max-w-[1200px] px-8 pt-[60px]">
        <div className="grid grid-cols-1 gap-9 min-[921px]:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-block rounded-lg bg-white px-3.5 py-3">
              <Image
                src={asset("logo-trinity-primary.png")}
                alt="Trinity Garage Door Service, Opening Doors Since 2007"
                width={670}
                height={372}
                className="h-auto w-[200px]"
              />
            </div>
            <p className="mt-[18px] max-w-[300px] text-[15px] leading-[1.6] text-[#8a8a8a]">
              Family owned garage door repair, replacement, and installation serving the Tampa
              Bay area since {SITE.foundedYear}.
            </p>
          </div>

          <FooterCol title="Services" links={FOOTER_SERVICES} />
          <FooterCol title="Resources" links={FOOTER_RESOURCES} />

          <div>
            <div className="mb-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white">Contact</div>
            <div className="flex flex-col gap-[11px] text-[15px]">
              <a href={SITE.phoneHref} className="font-heading text-[18px] font-extrabold text-white no-underline">
                {SITE.phoneDisplay}
              </a>
              <span>24/7 Emergency Service</span>
              <span>Lutz, FL · Tampa Bay</span>
            </div>
          </div>
        </div>

        <div className="mt-[46px] flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#2a2a2a] py-[22px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] font-medium text-[#6a6a6a]">
            <span>© {new Date().getFullYear()} {SITE.legalName} · Licensed &amp; Insured · {SITE.license}</span>
            <span aria-hidden="true">·</span>
            <a href="/privacy-policy/" className="text-[#8a8a8a] no-underline hover:text-accent">Privacy Policy</a>
          </div>
          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-9 w-9 items-center justify-center rounded-[7px] border-2 border-[#2a2a2a] text-[#cfcfcf]"
              >
                <Icon className="h-[17px] w-[17px]" />
              </a>
            ))}
            {/* Badge, not a link: we have no BBB profile URL, and `href="#"` shipped a dead
                link on every page. TODO(client): supply the BBB listing URL to make it a link. */}
            <span
              title="BBB accredited, A+ rating"
              className="flex h-9 items-center justify-center rounded-[7px] border-2 border-[#2a2a2a] px-3 text-[12px] font-extrabold tracking-[1px] text-[#cfcfcf]"
            >
              BBB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white">{title}</div>
      <div className="flex flex-col gap-[11px] text-[15px]">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="text-[#9a9a9a] no-underline hover:text-accent">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
