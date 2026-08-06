import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";

export const metadata: Metadata = {
  title: "Privacy Policy | Trinity Garage Door Service",
  description:
    "How Trinity Garage Door Service collects, uses, and protects the information you share through our website.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/privacy-policy/" },
};

/** Highlighted client placeholder (G16) — keep visible until confirmed. */
const Ph = ({ children }: { children: ReactNode }) => (
  <span className="rounded-[4px] bg-[#FBEDED] px-[7px] py-px text-[0.92em] font-bold text-[#8f1820]">{children}</span>
);

type Block = { h2: string } | { p: ReactNode } | { ul: ReactNode[] };

const blocks: Block[] = [
  { p: <>Trinity Garage Door Service, Inc. (&ldquo;Trinity,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This policy explains what information we collect through our website, how we use it, and the choices you have. By using this site or submitting a form, you agree to this policy.</> },
  { h2: "Information We Collect" },
  { p: <><strong className="font-bold text-ink">Information you give us.</strong> When you fill out our contact or free estimate form, or otherwise reach out, we collect the details you provide. That typically includes your name, phone number, email address, city, the service you need, and any message you send. If you call or email us, we keep what you share so we can help you.</> },
  { p: <><strong className="font-bold text-ink">Information collected automatically.</strong> Like most websites, our hosting platform records basic technical information when you visit, such as your IP address, browser type, and the pages you view. When you submit a form, we also record your IP address and browser details to help us prevent spam and abuse.</> },
  { p: "We do not collect payment card information through this website." },
  { h2: "How We Use Your Information" },
  { p: "We use the information you provide to:" },
  { ul: [
    "respond to your request and answer your questions",
    "schedule and carry out garage door service",
    "follow up about your inquiry or completed work",
    "keep records of the work we do",
    "keep the site secure and prevent spam and fraud",
    "improve our website and service",
  ] },
  { h2: "How We Share Your Information" },
  { p: "We do not sell your personal information. We share it only with the service providers that help us run this website and respond to you, and only as needed for them to do that work:" },
  { ul: [
    <><strong className="font-bold text-ink">Cloudflare</strong> hosts the website and stores form submissions in our database.</>,
    <><strong className="font-bold text-ink">Cloudflare Turnstile</strong> helps protect the form from spam and abuse.</>,
    <><strong className="font-bold text-ink">Resend</strong> delivers your form submission to our email inbox.</>,
    <><strong className="font-bold text-ink">Google</strong> provides the analytics and advertising tools described under Cookies below. Google receives usage data about your visit, such as pages viewed and a rough location. It does not receive what you type into our forms.</>,
    <><strong className="font-bold text-ink">Microsoft</strong> provides advertising measurement, and Microsoft Clarity, which records how visitors move through pages so we can see where the site is confusing. Clarity captures things like mouse movement, clicks, and scrolling.</>,
  ] },
  { p: "We may also disclose information if the law requires it, or to protect the safety, rights, or property of Trinity, our customers, or others." },
  { h2: "Where Your Information Is Stored" },
  { p: "Form submissions are sent to us by email and stored in our database. Our service providers may process and store data on servers located in the United States." },
  { h2: "Cookies And Similar Technologies" },
  { p: "The site uses cookies that are needed for it to work and for spam protection, and it uses Google Analytics to understand how people find and use the site. We use Google Tag Manager to load these tools, and we use Google Ads conversion tracking to see which of our ads bring people here." },
  { p: "Google Analytics sets cookies named _ga and _ga_ followed by an ID, which last up to two years, and in some cases _gid, which lasts about a day. Most browsers now shorten cookie lifetimes to around 400 days no matter what the cookie asks for. These tell us things like which pages get visited and roughly where in Tampa Bay our visitors are, in a way that does not identify you by name." },
  { p: "Google does not store your full IP address in Google Analytics. It uses the address to work out a rough location, then discards it." },
  /*
    Added 2026-08-04 with the click capture in middleware.ts. It is our own first party cookie, so
    nothing in the Google or Microsoft paragraphs covers it, and the policy has to name it.

    ⚠️ Note what this sentence carefully does NOT say. It does not claim anything about what Google
    receives, because the sentence two paragraphs above promises "It does not receive what you type
    into our forms", and that promise is still true and must stay true. If Enhanced Conversions for
    Leads is ever switched on, hashed contact details WOULD go to Google, that sentence becomes
    false, and this page has to change before the tag ships, not after. See GTM-NOTES.md.
  */
  { p: "If you arrive here by clicking one of our ads, we store the ad click reference from that link in a cookie on your device for 90 days, so that if you later send us a form we can tell which ad brought you. It holds a reference number and the page you landed on, not your name or your details, and we do not use it to show you advertising." },
  { p: "We also use Microsoft advertising measurement, and Microsoft Clarity, which records how people move through the site so we can find pages that confuse visitors. Clarity records mouse movement, clicks and scrolling, and it is set to hide what you type into form fields." },
  { p: "If you would rather not be counted, Google publishes a browser add on that turns Google Analytics off across every site you visit. You can get it at tools.google.com/dlpage/gaoptout. Microsoft Clarity honors your browser's Do Not Track setting. You can also block cookies in your browser settings." },
  { h2: "Your Choices" },
  { p: "You can contact us at any time to ask what information we have about you, to correct it, or to ask us to delete it. You can also tell us to stop following up with you. To make a request, use the contact details below." },
  { h2: "Data Security" },
  { p: "We take reasonable steps to protect the information you share with us. No method of transmission or storage is completely secure, however, so we cannot guarantee absolute security." },
  { h2: "Children's Privacy" },
  { p: "This website is meant for adults and is not directed to children under 13. We do not knowingly collect personal information from children." },
  { h2: "Links To Other Sites" },
  { p: "Our site may link to other services, such as our online booking tool or social media pages. We are not responsible for the privacy practices of those other sites, so please review their policies." },
  { h2: "Changes To This Policy" },
  { p: "We may update this policy periodically. When we do, we will change the effective date at the top of this page." },
];

export default function PrivacyPolicyPage() {
  let seenH2 = false;
  return (
    <>
      {/* HEADER BAND */}
      <section className="border-b-[5px] border-accent bg-[#161616] px-6 py-16">
        <div className="mx-auto max-w-[860px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          <h1 className="m-0 mt-4 font-display text-[clamp(30px,4.6vw,52px)] font-black uppercase leading-none tracking-[-0.015em] text-white">Privacy Policy</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-[15px] py-2 text-[13.5px] font-semibold text-white">
              Effective date: <span className="rounded-[4px] bg-[rgba(184,32,42,0.25)] px-[7px] py-px text-[0.92em] font-bold text-white">[date you publish]</span>
            </span>
          </div>
        </div>
      </section>

      {/* LEGAL BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[860px] px-6 pb-20 pt-14">
          {/* review-with-counsel callout */}
          <div className="mb-10 flex items-start gap-3.5 rounded-[10px] border-2 border-[#F0DCDC] bg-[#FBF3F3] px-5 py-[18px]">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none text-accent">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p className="m-0 text-[14.5px] font-medium leading-[1.6] text-[#7a3b3b]">
              Starting template tailored to what this site collects. Have it reviewed by legal counsel before publishing, and fill the highlighted placeholders once your contact email and mailing address are confirmed.
            </p>
          </div>

          <div>
            {blocks.map((b, i) => {
              if ("h2" in b) {
                const first = !seenH2;
                seenH2 = true;
                return (
                  <h2
                    key={i}
                    className={
                      first
                        ? "mb-0 mt-1.5 font-display text-[20px] font-extrabold uppercase tracking-[-0.005em] text-ink"
                        : "mt-[42px] border-t-2 border-[#ececec] pt-5 font-display text-[20px] font-extrabold uppercase tracking-[-0.005em] text-ink"
                    }
                  >
                    {b.h2}
                  </h2>
                );
              }
              if ("ul" in b) {
                return (
                  <ul key={i} className="mt-3.5 flex list-none flex-col gap-2.5 p-0">
                    {b.ul.map((li, j) => (
                      <li key={j} className="relative pl-6 text-[16.5px] leading-[1.6] text-[#3a3a3a]">
                        <span className="absolute left-0.5 top-[9px] h-2 w-2 rounded-[2px] bg-accent" />
                        {li}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mt-3.5 text-[16.5px] leading-[1.72] text-[#3a3a3a]">{b.p}</p>
              );
            })}
          </div>

          {/* CONTACT US block */}
          <div className="mt-11 rounded-[12px] bg-ink p-[30px_32px] text-white">
            <div className="font-display text-[18px] font-extrabold uppercase">Contact Us</div>
            <p className="mb-[18px] mt-3 text-[15.5px] leading-[1.6] text-[#cfcfcf]">If you have questions about this policy or your information, contact us:</p>
            <div className="flex flex-col gap-[9px] text-[15.5px] text-[#e8e8e8]">
              <div className="font-display text-[16px] font-bold text-white">Trinity Garage Door Service, Inc.</div>
              <div><span className="text-[#9a9a9a]">Phone:</span> <a href={SITE.phoneHref} className="font-bold text-white no-underline">{SITE.phoneDisplay}</a></div>
              <div><span className="text-[#9a9a9a]">Email:</span> <Ph>[contact email to confirm]</Ph></div>
              <div><span className="text-[#9a9a9a]">Address:</span> <Ph>[business mailing address to confirm]</Ph></div>
              <div className="mt-1 text-[14.5px] text-[#9a9a9a]">Serving Tampa Bay, Florida, across five counties.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
