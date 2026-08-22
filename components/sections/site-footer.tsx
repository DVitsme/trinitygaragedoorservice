import Image from "next/image";
import { FacebookIcon, InstagramIcon, YelpIcon, GoogleIcon } from "@/components/social-icons";
import { SITE, SOCIAL, asset } from "@/lib/site";

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
 * Real business profiles, sourced from Trinity's own listings (see SOCIAL in lib/site.ts).
 * These replaced the four dead `href="#"` links this footer used to ship on every page.
 * LinkedIn is intentionally absent: there is no company page, only Jason's personal profile.
 */
const SOCIALS = [
  { Icon: InstagramIcon, label: "Instagram", href: SOCIAL.instagram },
  { Icon: FacebookIcon, label: "Facebook", href: SOCIAL.facebook },
  { Icon: GoogleIcon, label: "Google Business Profile", href: SOCIAL.google },
  { Icon: YelpIcon, label: "Yelp", href: SOCIAL.yelp },
];

/**
 * Directories with no icon in the set; rendered as wordmark chips instead.
 *
 * ⚠️ **NEXTDOOR was added 2026-08-13 for a specific reason: the site now claims "1,000+ reviews
 * online" and names Nextdoor as one of the six sources.** Before this it was linked nowhere on the
 * site and existed only inside the JSON-LD `sameAs` array, so a reader who wanted to check that
 * part of the claim had nowhere to go. Naming a platform we do not link is the kind of small
 * unverifiable gap that makes a whole number look invented. If the claim ever stops naming
 * Nextdoor, this chip can go with it.
 *
 * There is no Nextdoor glyph in `components/social-icons.tsx` and lucide 1.x dropped brand icons,
 * so it is a wordmark like BBB and ANGI rather than an invented logo.
 */
const BADGES = [
  { label: "BBB", title: "BBB accredited, A+ rating", href: SOCIAL.bbb },
  { label: "ANGI", title: "Angi Super Service Award winner", href: SOCIAL.angi },
  { label: "NEXTDOOR", title: "Trinity on Nextdoor", href: SOCIAL.nextdoor },
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
              <span>Phones Answered Till 9pm</span>
              {/*
                The real street addresses, in the footer on every page. Google reads a consistent
                NAP (name, address, phone) across a site as an entity signal, and this business gets
                most of its customers through local search.

                ⚠️ **These match the LocalBusiness JSON-LD exactly, and that is the point: a
                mismatch is worse than an omission.** Lutz is the primary entity there; Oldsmar and
                Tampa are branch nodes pointing at it. If you add, remove or reorder a location
                here, change `components/json-ld.tsx` in the same commit or the two disagree and the
                markup becomes a liability rather than a signal.

                Driven off `SITE.locations` rather than three hardcoded blocks, so there is one
                place to edit and the footer cannot silently drift from the structured data.
              */}
              <div className="flex flex-col gap-[9px]">
                {SITE.locations.map((loc) => (
                  <address key={loc.label} className="not-italic leading-[1.5]">
                    {/* The town label earns its place: with three addresses stacked, the reader is
                        scanning for their own area, not reading prose. */}
                    <span className="block text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#8a8a8a]">
                      {loc.label}
                    </span>
                    {loc.street}
                    <br />
                    {loc.city}, {loc.region} {loc.postalCode}
                  </address>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[46px] flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#2a2a2a] py-[22px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] font-medium text-[#8a8a8a]">
            <span>© {new Date().getFullYear()} {SITE.legalName} · Licensed &amp; Insured · {SITE.license}</span>
            <span aria-hidden="true">·</span>
            <a href="/privacy-policy/" className="text-[#8a8a8a] no-underline hover:text-accent">Privacy Policy</a>
          </div>
          {/*
            ⚠️ **`flex-wrap` is load bearing, not tidiness.** This row was `nowrap` with six items at
            307.8px inside a 311px parent, which fitted by 3px. Adding the NEXTDOOR chip takes it to
            417.5px and produced real horizontal page overflow at 375px wide, measured, where
            `document.scrollWidth` went from 375 to 450. Wrapping is what makes a seventh chip safe.
            If you add an eighth, re-measure rather than assuming.
          */}
          {/*
            No `justify-end`. With it, the wrap at 372 to 481px put six chips on one line and left
            NEXTDOOR as a lone orphan hanging at the far right, which covers 375, 390, 393, 412, 414,
            428 and 430, so most phones. Left aligned, the seventh chip sits under the first and
            reads as a second row rather than a mistake. Below 372 it wraps 5 and 2, which is fine.

            That second row is also what exposed a much older bug: the sticky mobile bar is `fixed`
            and nothing reserved its height, so the last 72px of every page sat behind it. The chip
            was completely unreachable until `StickyMobileBar` gained a spacer. Measured after the
            fix: chip bottom 806 against bar top 828, so 22px of clearance at 320 through 768.
          */}
          <div className="flex flex-wrap items-center gap-2.5">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-9 w-9 items-center justify-center rounded-[7px] border-2 border-[#2a2a2a] text-[#cfcfcf] transition-colors hover:border-accent hover:text-white"
              >
                <Icon className="h-[17px] w-[17px]" />
              </a>
            ))}
            {BADGES.map(({ label, title, href }) => (
              <a
                key={label}
                href={href}
                title={title}
                aria-label={title}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center justify-center rounded-[7px] border-2 border-[#2a2a2a] px-3 text-[12px] font-extrabold tracking-[1px] text-[#cfcfcf] no-underline transition-colors hover:border-accent hover:text-white"
              >
                {label}
              </a>
            ))}
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
