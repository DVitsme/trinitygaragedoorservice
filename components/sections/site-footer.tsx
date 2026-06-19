import Image from "next/image";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YelpIcon, GoogleIcon } from "@/components/social-icons";
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

const SOCIALS = [
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: SITE.instagram },
  { Icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { Icon: YelpIcon, label: "Yelp", href: "#" },
  { Icon: GoogleIcon, label: "Google", href: "#" },
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
                width={230}
                height={80}
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
          <div className="text-[13px] font-medium text-[#6a6a6a]">
            © {new Date().getFullYear()} {SITE.legalName} · Licensed &amp; Insured · {SITE.license}
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
            <a
              href="#"
              aria-label="Better Business Bureau"
              className="flex h-9 items-center justify-center rounded-[7px] border-2 border-[#2a2a2a] px-3 text-[12px] font-extrabold tracking-[1px] text-[#cfcfcf]"
            >
              BBB
            </a>
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
