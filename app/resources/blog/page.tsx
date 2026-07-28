import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { getAllPosts, getCategories } from "@/lib/blog";
import { Breadcrumb } from "@/components/blocks/primitives";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Garage Door Blog | Trinity Garage Door Service Tampa Bay",
  description:
    "Practical garage door advice for Tampa Bay homeowners: springs, openers, storm season, maintenance, and buying a new door. Family owned. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/resources/blog/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [{ label: "Home", href: "/" }, { label: "Blog" }];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const [lead, ...rest] = posts;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[88px]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 84% 26%, rgba(184,32,42,0.28), transparent 48%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">From The Shop</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,62px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            Garage Door <span className="inline-block bg-accent px-3 text-white">Advice</span>
          </h1>
          <p className="mt-6 max-w-[700px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">
            What we learn on Tampa Bay driveways, written down. Springs that give out in the heat, openers that quit, storm season prep, and how to tell a quick fix from a real repair.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <span key={c.name} className="rounded-full border border-white/20 bg-white/[0.08] px-[15px] py-2 text-[13px] font-semibold text-white">
                {c.name} <span className="text-white/55">{c.count}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD POST */}
      {lead ? (
        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-5 pb-2 pt-[64px] nav:px-8">
            <Reveal>
              <Link href={`${ROUTES.blog}${lead.slug}/`} className="group grid items-center gap-9 no-underline nav:grid-cols-[1.15fr_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border-2 border-ink">
                  <Image src={lead.featuredImage} alt={lead.featuredImageAlt} fill sizes="(max-width: 920px) 100vw, 640px" priority className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute left-4 top-4 rounded-[6px] bg-accent px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-white">Latest</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em]">
                    <span className="text-accent">{lead.category}</span>
                    <span className="text-[#b6b6b6]">{lead.dateLabel}</span>
                  </div>
                  <h2 className="m-0 mt-3.5 font-display text-[clamp(24px,3.1vw,36px)] font-extrabold uppercase leading-[1.06] text-ink">{lead.title}</h2>
                  <p className="mt-4 text-[17px] leading-[1.62] text-body">{lead.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-extrabold uppercase tracking-[0.05em] text-accent">
                    Read the post <ArrowRight className="h-[17px] w-[17px] transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ALL POSTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 pb-[84px] pt-[52px] nav:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-6 border-t-2 border-ink pt-9">
              <div>
                <div className={eyebrowCls}>The Archive</div>
                <h2 className="m-0 mt-2.5 font-display text-[clamp(24px,3vw,34px)] font-extrabold uppercase leading-[1.04] text-ink">More From Trinity</h2>
              </div>
              <span className="hidden text-[13px] font-semibold text-[#8a8a8a] xs:block">{posts.length} posts</span>
            </div>
          </Reveal>

          <div className="mt-9 grid gap-7 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.05}>
                <Link href={`${ROUTES.blog}${p.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-[9px] border-2 border-ink bg-white no-underline transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.13)]">
                  <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink">
                    <Image src={p.featuredImage} alt={p.featuredImageAlt} fill sizes="(max-width: 560px) 100vw, (max-width: 920px) 50vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col p-[20px_20px_22px]">
                    <div className="flex items-center gap-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.09em]">
                      <span className="text-accent">{p.category}</span>
                      <span className="text-[#b6b6b6]">{p.dateLabel}</span>
                    </div>
                    <h3 className="m-0 mt-2.5 font-display text-[17.5px] font-extrabold uppercase leading-[1.2] text-ink">{p.title}</h3>
                    <p className="mt-2.5 flex-1 text-[14.5px] leading-[1.6] text-body">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-extrabold uppercase tracking-[0.05em] text-accent">
                      Read more <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-black uppercase leading-none">Rather Just Ask Someone?</h2>
            <p className="mx-auto mt-4 max-w-[660px] text-[17.5px] font-medium leading-[1.55] text-white/90">
              Reading about it only gets you so far. Tell us what your door is doing and we&apos;ll tell you straight whether it needs a tech or a five minute fix you can handle yourself.
            </p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">
                <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
              </a>
              <Link href={ROUTES.estimate} className="rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">Request a Free Estimate</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
