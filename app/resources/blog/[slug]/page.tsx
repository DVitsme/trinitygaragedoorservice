import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowLeft, ArrowRight } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { getAllPosts, getPost } from "@/lib/blog";
import { Breadcrumb } from "@/components/blocks/primitives";
import { Reveal } from "@/components/blocks/reveal";

const SITE_URL = "https://trinitygaragedoorservice.com";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Trinity Garage Door Service`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}${ROUTES.blog}${post.slug}/` },
  };
}

/**
 * Prose styling for the rendered markdown. The bodies are verbatim client content, so the type
 * scale is applied here by descendant selector rather than by editing the source posts.
 */
const prose = [
  "text-[17px] leading-[1.72] text-[#3a3a3a]",
  "[&>p]:mt-[18px]",
  "[&>h2]:mt-[44px] [&>h2]:mb-0 [&>h2]:border-t-2 [&>h2]:border-[#ececec] [&>h2]:pt-6 [&>h2]:font-display [&>h2]:text-[21px] [&>h2]:font-extrabold [&>h2]:uppercase [&>h2]:leading-[1.18] [&>h2]:tracking-[-0.005em] [&>h2]:text-ink",
  "[&>h3]:mt-8 [&>h3]:mb-0 [&>h3]:font-display [&>h3]:text-[17px] [&>h3]:font-extrabold [&>h3]:uppercase [&>h3]:leading-[1.2] [&>h3]:text-ink",
  "[&>ul]:mt-4 [&>ul]:flex [&>ul]:list-none [&>ul]:flex-col [&>ul]:gap-2.5 [&>ul]:p-0",
  "[&>ol]:mt-4 [&>ol]:flex [&>ol]:list-none [&>ol]:flex-col [&>ol]:gap-2.5 [&>ol]:p-0",
  "[&_li]:relative [&_li]:pl-6 [&_li]:text-[16.5px] [&_li]:leading-[1.6]",
  "[&_li]:before:absolute [&_li]:before:left-0.5 [&_li]:before:top-[9px] [&_li]:before:h-2 [&_li]:before:w-2 [&_li]:before:rounded-[2px] [&_li]:before:bg-accent [&_li]:before:content-['']",
  "[&_strong]:font-bold [&_strong]:text-ink",
  "[&_a]:font-semibold [&_a]:text-accent [&_a]:underline",
  "[&>p:first-child]:mt-0",
].join(" ");

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Blog", href: ROUTES.blog },
    { label: post.title },
  ];

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

  // BlogPosting schema deliberately omits datePublished: the source dates are approximate
  // (inferred from WordPress upload paths), and the house rule is to omit rather than assert.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.featuredImage}`,
    articleSection: post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${ROUTES.blog}${post.slug}/` },
    author: { "@type": "Organization", name: SITE.legalName },
    publisher: { "@type": "Organization", name: SITE.legalName },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[72px]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 82% 24%, rgba(184,32,42,0.26), transparent 50%)" }} />
        <div className="relative z-[2] mx-auto max-w-[860px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: ROUTES.blog }, { label: post.category }]} />
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em]">
            <span className="rounded-[5px] bg-accent px-2.5 py-1.5 text-white">{post.category}</span>
            <span className="text-white/60">{post.dateLabel}</span>
          </div>
          <h1 className="m-0 mt-[18px] font-display text-[clamp(28px,4.4vw,48px)] font-black uppercase leading-[1.03] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            {post.title}
          </h1>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[860px] px-6 pb-16 pt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[10px] border-2 border-ink">
            <Image src={post.featuredImage} alt={post.featuredImageAlt} fill sizes="(max-width: 920px) 100vw, 860px" priority className="object-cover" />
          </div>

          <article className={`mt-10 ${prose}`} dangerouslySetInnerHTML={{ __html: post.html }} />

          {/* Contact card */}
          <div className="mt-12 rounded-[12px] bg-ink p-[30px_32px] text-white">
            <div className="text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-accent-on-dark">Need A Hand?</div>
            <h2 className="m-0 mt-2.5 font-display text-[22px] font-extrabold uppercase leading-[1.15] text-white">
              We&apos;re Local, And We Answer The Phone
            </h2>
            <p className="mt-3 text-[16px] leading-[1.6] text-[#a8a8a8]">
              Serving Lutz, Land O Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa, and north Manatee. Free estimates, and no pressure to buy anything you don&apos;t need.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-accent px-7 py-[15px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-accent-dark">
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
              </a>
              <Link href={ROUTES.estimate} className="rounded-[7px] border-2 border-white/25 px-6 py-[13px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">Free Estimate</Link>
            </div>
          </div>

          <Link href={ROUTES.blog} className="mt-10 inline-flex items-center gap-2 text-[14px] font-extrabold uppercase tracking-[0.05em] text-accent no-underline">
            <ArrowLeft className="h-[17px] w-[17px]" strokeWidth={2.4} /> All posts
          </Link>
        </div>
      </section>

      {/* MORE POSTS */}
      {more.length > 0 ? (
        <section className="border-t-2 border-ink bg-cream">
          <div className="mx-auto max-w-[1200px] px-5 py-[72px] nav:px-8">
            <Reveal>
              <h2 className="m-0 font-display text-[clamp(22px,2.8vw,32px)] font-extrabold uppercase leading-[1.04] text-ink">Keep Reading</h2>
            </Reveal>
            <div className="mt-7 grid gap-6 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {more.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link href={`${ROUTES.blog}${p.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-[9px] border-2 border-ink bg-white no-underline transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.13)]">
                    <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink">
                      <Image src={p.featuredImage} alt={p.featuredImageAlt} fill sizes="(max-width: 560px) 100vw, (max-width: 920px) 50vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </div>
                    <div className="flex flex-1 flex-col p-[18px_18px_20px]">
                      <div className="text-[11.5px] font-extrabold uppercase tracking-[0.09em] text-accent">{p.category}</div>
                      <h3 className="m-0 mt-2 font-display text-[16.5px] font-extrabold uppercase leading-[1.2] text-ink">{p.title}</h3>
                      <span className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-extrabold uppercase tracking-[0.05em] text-accent">
                        Read <ArrowRight className="h-[14px] w-[14px] transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
