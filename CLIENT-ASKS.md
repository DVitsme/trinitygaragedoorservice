# WHAT I NEED FROM TRINITY

Things only Jason or Simone can answer or provide. Tick them off as they come in.

**Living document.** Last updated: 2026-07-29. Deeper detail: `PRE-LAUNCH-PUNCHLIST.md`,
`MEDIA-INVENTORY.md`, `LAUNCH-CHECKLIST.md`.

---

## 📞 DECIDED IN THE 29 JULY CALL (Simone, Lloyd, Jason by phone)

Transcript: `transcript/7-29-2026.md`. **Read this block before doing any more build work, two of
these reverse things already shipped.**

1. **The booking modal is out. A short custom lead form replaces it.** Jason chose "fill out the
   information, we call them back" over self service booking, explicitly to **keep pricing off the
   site**: *"I don't want to scare people... they may just call around and say what are you
   charging."* Housecall Pro's embed cannot be trimmed (its zip gate, service picker and pricing
   are one flow, take it or leave it), so we build our own.
   **Fields, per Jason:** first name, last name, phone, email, **zip**, plus a free text box for
   what the problem is. **No pricing, no package picker.**
   **Where it goes:** email to `trinitygaragedoorservice@gmail.com` (Barbara) **first**, then push
   to Housecall Pro leads for Lloyd's attribution. Email is the lighter call so it fires first.
   ⚠️ **This supersedes the `window.HCPWidget.openModal()` work shipped on 2026-07-28.**
2. **Analytics is Google, not Cloudflare.** Lloyd creates a separate GA property and sends a **GTM
   container**. We embed the container; he owns the tags.
3. **Hours copy changes sitewide.** Booking 8am to 4pm, **phones answered until 9pm**, closed
   Sunday. **The 24/7 wording comes off** (~30 places plus the JSON-LD).
4. **Drive Social's API key gets deleted.** They are the previous vendor, not current.
5. **Blog is a monthly email workflow.** Annek writes, we publish. No CMS needed.
6. **Launch is close.** Simone sent Jason the staging link and expects to give the green light
   after he looks. Migration is ours: back up the WordPress site, then cut over.

**Still to chase from this call:** Lloyd's GTM code, Jason adding us to Google Business Profile,
and the Saturday booking conflict at #4a.

---

## 🔴 BLOCKS LAUNCH (site cannot go live without these)

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 1 | ~~Which phone number is the main one?~~ | **ANSWERED 2026-07-29: (813) 279-6785 confirmed primary by Jason.** The three county lines stay on the contact page. **He also said the 877 toll free number is not needed** ("I don't necessarily think we need it"), so drop it. Old note: Their own Housecall Pro account lists **(813) 279-6785** as the company number, which is what the site already uses everywhere. Contact page lists all three county lines. Just needs a yes from Jason. | ◐ |
| 2 | ~~What year did the business start?~~ | **ANSWERED 2026-07-28: 2007.** Now used sitewide, and the "years in business" figure is calculated from it so it can never go stale. | ☑ |
| 3 | ~~Confirm the address~~ | **ANSWERED 2026-07-28 from their own Housecall Pro record:** 18125 US-41, Suite 208, Lutz FL 33549. This is the address they dispatch from, so it is authoritative. Map coordinates captured too. | ☑ |
| 4 | ~~What are the real office hours?~~ | **ANSWERED 2026-07-29 (Simone, with Jason on the phone).** Booking windows are **8am to 4pm** in **two hour increments** (8 to 10, 10 to 12, and so on), last appointment 4 to 6. **Phones are answered until 9pm.** Closed Sunday. | ☑ |
| 4a | 🔴 **NEW CONFLICT: Simone said customers can book Monday to Saturday. Housecall Pro offers no Saturday at all.** | Verified against their own API on 2026-07-29: **242 booking windows over 21 days, every one of them Monday to Friday. Saturday count is zero.** So if we put "Monday to Saturday" on the site, a customer who picks Saturday finds nothing bookable. Either Jason adds Saturday hours in Housecall Pro, or the site says Monday to Friday. **Do not publish Saturday until one of those happens.** | ☐ |
| 4b | ~~Is the "24/7" promise deliberate?~~ | **ANSWERED 2026-07-29.** Jason's reading: it means **the phone is answered**, not that they service around the clock. Simone gave the practical answer and the decision: **say "we answer the phones till 9pm"** rather than 24/7. Derrick confirmed the wording with her directly. **This changes roughly 30 places on the site plus the JSON-LD opening hours.** | ☑ |
| 5 | ~~Email account for website leads~~ | **RESOLVED 2026-07-29.** Simone supplied the Resend login on the call and the login was confirmed working. Leads go to **trinitygaragedoorservice@gmail.com**, which is **Barbara**, Jason's office person. Domain verification still to do. | ☑ |
| 5b | 🔴 **STILL OPEN. The licence question was not actually answered.** | Asked on the call. The answer given was about **coverage**, not licensing ("we work through all counties, Hillsborough, Pasco, Pinellas, Polk, Hernando, some of the Sarasota area"). That does not tell us whether **GD13010 / GDI-09484** are county or Florida state licences, or whether the **Pasco renewal due 30 Sept 2026** is filed. The site claims "licensed in Florida" on **25 pages**. **This is still the only item on the list with legal exposure. Ask Jason directly, not Simone.** | ☐ |
| 6 | ~~A public email address~~ | **ANSWERED 2026-07-29: `trinitygaragedoorservice@gmail.com`.** It is Barbara's inbox and Simone says it has always worked well. A domain address was not wanted. | ☑ |
| 6b | **New: is Sarasota in or out?** | Simone named **"some of the areas in the Sarasota area"** as served. Sarasota is a **6th county** and is **not** in the 130 zip Housecall Pro zone the whole site is built from. Either it is genuinely served and the zone is out of date, or it was a one off. Jason offered to review a list of towns, so send him one. | ☐ |

---

## 🟠 NEEDED BEFORE WE GO PUBLIC

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 7 | **Cloudflare account access** | To turn on real spam protection for the form. Takes 2 minutes. | ☐ |
| 8 | **Domain / DNS access** | To point trinitygaragedoorservice.com at the new site. | ☐ |
| 9 | **Confirm the numbers we quote** | Site says 12,000+ doors serviced, 4.9 stars, 6 cities. Are these true? (Years is now calculated from 2007, so that one is handled.) | ☐ |
| 10 | **Confirm brands they INSTALL vs only REPAIR** | We list install = Clopay, C.H.I., Hörmann, Amarr, LiftMaster. Everything else repair only. | ☐ |
| 11 | **Mailing address for the privacy policy** | Legal requirement. Can be the Lutz suite. | ☐ |
| 12 | **Have a lawyer glance at the privacy policy** | It is a solid starting template, not legal advice. | ☐ |
| 13 | ⚠️ **"Veteran owned" needs a real answer, and the honest one is awkward** | **PART ANSWERED 2026-07-29.** Jason's **son** is the veteran and works in the business. **Jason owns the company and is not a veteran.** The son suggested adding the badge because "it'll help". Simone is checking with a contact and said **leave it on for now**, and she will tell Jason if it is a problem. Worth being blunt with her: "veteran owned" normally means **owned** by a veteran, and misusing it on a contractor site is the kind of claim that draws complaints. | ◐ |
| 14 | **Which Facebook page is the real one?** | There are two. We are linking the LLC one. The other is an "Inc" page we could not open. | ☐ |
| 15 | **Confirm the 2007 story** | Did Jason start doing the work in 2007 and incorporate in 2011? If yes, everything is consistent and it is just a listings cleanup. If the business really began in 2011, the logo tagline needs rethinking. | ☐ |

---

## 🔧 FOR THEM TO GO FIX (their own listings, not our website)

These do not block us. They are things only Trinity can change, and each one helps Google trust
their business details.

| # | Action | Why it matters | Status |
|---|---|---|---|
| A | **Change "established" to 2007 on Yelp and BBB** | Yelp says 2010, BBB says 2011, the site says 2007. Mismatched details weaken local search ranking. **Leave the Florida state record alone** — that one records incorporation and is a different fact. | ☐ |
| B | **Fix "16 years of experience" on Angi** | Implies 2010. Should match 2007. | ☐ |
| C | **Claim and merge the duplicate Yelp page** | There are two. Reviews and traffic get split between them. | ☐ |
| D | **Sort out the two Facebook pages** | An LLC page and an Inc page. Pick one and retire the other. | ☐ |
| E | **Fix the hours on Google** | Google says Mon to Sat 7am to 9pm, their front door says Mon to Fri 8am to 5:30pm. Customers see the Google one. | ☐ |
| F | **Claim and optimise the Google Business Profile** | Their single biggest source of local leads. They already have 5.0 stars from 597 reviews. | ☐ |

---

## 📷 PHOTOS AND VIDEO STILL WANTED

The site is fully stocked with real photos now. These would make it noticeably better.

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 16 | **Original video files** for the 3 minute promo and the 13 second door clip | **Biggest visual win available.** The copies online are low quality and one is in a format browsers refuse to play. The homepage hero uses video. | ☐ |
| 17 | **2 or 3 job photos per city** (Lutz, Land O Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa) | We have hundreds of job photos but no idea which town each is in, so city pages use generic ones. | ☐ |
| 18 | **The 47 photos off their Yelp page** | Yelp blocks us from downloading them. Easier for them to send. | ☐ |
| 18b | 🔑 **More of their Google reviews, ideally with the town** | **This one unlocks real growth.** They have **597 reviews**. We only have **8**, and all but two are already used, one per town page. We cannot invent testimonials, so **we cannot add town pages for St Petersburg, Clearwater, Lakeland and the rest until we have real reviews from those towns.** Easiest fix: give us access to the Google Business Profile and we pull them ourselves. Otherwise, 3 or 4 reviews per town, copied and pasted. | ☐ |
| 19 | **Any commercial job photos** | They sell commercial doors but we found zero photos of commercial work. | ☐ |

---

## 💬 QUICK DECISIONS (one word answers, no research needed)

| # | Ask | Options | Status |
|---|---|---|---|
| 20 | The old "promo discounts" page | Send visitors to Contact, or bring the promos back? | ☐ |
| 21 | Their old Lutz blog post | Keep it as a blog post, or point it at the Lutz service area page? | ☐ |
| 22 | An old blog post says repairs run **"$65 to $600"** | Still accurate, or should we cut the prices? | ☐ |
| 23 | Blog post dates | Ours are approximate. Do they have the real publish dates? | ☐ |
| 24 | 🔎 **We can now name the two stock images**, which makes this answerable | They are **`hurricane-ready-5-signs.jpg`** and **`strange-noise-goblin.jpg`**, both carrying a Shutterstock marker in the file itself. Both are still on the site. The question is unchanged and only Jason can answer it: **who bought them?** A Shutterstock licence belongs to the buyer and does not transfer with the picture, so if the old web company paid, the licence stayed with them. If he cannot show a receipt, we should swap both for real job photos, which now takes about ten minutes. Old note: We found a second one. The real question is **who bought them**. Shutterstock licences belong to the buyer and **cannot be transferred**, so if the old web company bought them, the licence stays with them and does not come with the pictures. | ☐ |
| 24b | ~~Three blog images were made by AI~~ | ✅ **DONE 2026-07-31, no longer a question.** All three are replaced with real Trinity job photos, including **the first image on the blog**, which was AI generated and is now a photo of one of their own technicians working on a torsion spring. The AI files are deleted. Still worth telling them it happened, since it came from the old web company and the hidden tag was readable by Google and Facebook. Old note: Their old blog used AI generated pictures, and the files still carry a hidden tag saying so, which Google and Facebook can read and label. One of them is the **first picture people see** on the blog. We have hundreds of their real job photos, so this is an easy swap. **Not something we did, it came over from the old site.** | ☐ |
| 25 | Manufacturer product photos | Are they allowed to use Clopay / C.H.I. / LiftMaster images as a dealer? | ☐ |
| 25b | **Can we advertise "no trip charge" on the homepage?** | Their own Housecall Pro account says the trip charge is **$0 on both service zones**, so we believe it. But it is a pricing promise going on the front page, and it is the kind of thing that changes with fuel prices. One yes from Jason and it goes in. It is a genuine differentiator we currently say nowhere. | ☐ |

---

## 🔑 HOUSECALL PRO (new, 2026-07-28)

We tested their Housecall Pro API keys and they work. That opens up real capability, and turned up
one thing worth a careful conversation.

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 29 / 30 | ~~Drive Social API key~~ | **ANSWERED 2026-07-29, and it is what we suspected.** Drive Social is **Jason's previous marketing person, not a current vendor.** Lloyd confirmed he does not use it and builds his own tracking through Tag Manager. Simone: **"let's get rid of that one."** So the key should be deleted, and it has had **full read access to 6,001 customer records** in the meantime. | ☑ |
| 31 | **Generate a separate API key for the website** | Named something like "website". Then either key can be switched off without breaking the other. Jason must do this himself, only Admins can. | ☐ |
| 32 | **One booking link per service page?** | Housecall Pro can make several booking links, each tagged. If he makes one per service, he sees exactly which page produced each booking. Takes a few minutes in their settings. | ☐ |
| 33 | **Which service area is current, 130 zip codes or 268?** | They have two saved. The 130 one has the technicians assigned to it, so we assume that is the live one. | ☐ |
| 34 | **Do they want website leads pushed into Housecall Pro?** | We can make contact form submissions appear in their Job Inbox next to their Angi and Yelp leads. Nothing extra to buy, it is included in the plan they already pay for. | ☐ |
| 36 | ~~Website analytics~~ | **ANSWERED 2026-07-29: Google Analytics, not Cloudflare.** They already run **GA plus Google Tag Manager** on the WordPress site. **Lloyd (Annek's ads specialist) is creating a separate GA property for the new site and sending the GTM container code.** We embed the container and he manages tags from his side. ⚠️ **This uses cookies, so the privacy policy must be updated the same day it goes on**, and it needs a cookie/consent line the Cloudflare option would have avoided. | ☑ |
| 35 | 🔑 **Switch on the booking redirect in Housecall Pro (2 minutes, Jason only)** | **This is the only way we can ever tell you how many jobs the website brings in.** Housecall Pro does not tell a website when somebody finishes booking, so the one supported trick is to send them to a "thank you" page afterwards and count who lands on it. **We have built that page already, it is finished and waiting.** All Jason has to do is: **Settings → Online Booking → booking redirect**, and paste in `https://trinitygaragedoorservice.com/book-a-repair/thank-you/` (use the temporary workers.dev address instead if we have not moved the domain over yet). Nothing else changes for the customer, they just see a proper confirmation page instead of being left in the booking window. **Until he does this, every number about whether the new site works is a guess.** | ☐ |
| 34b | 🔴 **If yes: Jason has to be on hand for one 5 minute test** | **This is the only thing standing between us and switching it on, and we cannot do it without him.** Housecall Pro has **no test mode** and **no way to delete a lead through the software we use**. So we create one obviously fake test lead (fake name, a 555 phone number that cannot ring anyone, notifications turned off), check it lands in his Job Inbox, and then **he deletes it himself in Housecall Pro**. Deleting is reversible and does not message anyone. **We can create it. We cannot remove it.** Also needed from him first: **a separate API key just for the website**, so it can be switched off without breaking anything the marketing company uses. | ☐ |

---

## 🟢 LATER (only when they want these features)

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 26 | ~~Housecall Pro plan level~~ | **ANSWERED 2026-07-28: they are on MAX**, the top tier (about $299/month). We confirmed this because API access works, and that is MAX only. **They are already paying for more than they use.** | ☑ |
| 27 | **Google account access** | To turn on the "are you in our service area?" address checker. Costs about nothing to run. | ☐ |
| 28 | **Google Business Profile access** | **UNBLOCKED 2026-07-29.** Simone checked live on the call: **Jason is the owner on GMB, so he can add us directly.** No need to chase the unresponsive old guy. | ◐ |

---

## Changelog
- **2026-07-31** Blog media cleaned up. **#24b done**, all three AI images replaced with real job photos. **#24 sharpened**, we can now name the two Shutterstock files. Blog images went from 21 MB to 1.8 MB.
- **2026-07-29** Client call. Answered #1, #4, #4b, #5, #6, #29, #30, #36. Raised **#4a (Saturday booking conflict, verified against their API)** and **#6b (Sarasota)**. #5b licences **still open**, the answer given was about coverage not licensing. #13 veteran owned became more delicate, not less. Direction changes recorded at the top.
- **2026-07-28** Booking thank you page built and live. Added #35 (Jason points HCP's booking redirect at it) and #36 (turn on analytics, recommend Cloudflare Web Analytics). Without both, bookings stay uncountable.
- **2026-07-28** Service areas section redesign planned (`SERVICE-AREA-REDESIGN.md`). Added #25b, whether we can advertise the $0 trip charge their own system reports.
- **2026-07-28** Housecall Pro keys tested and working. Added asks 29 to 34. **Address (#3) answered** from their own HCP record, **plan level (#26) answered (MAX)**, phone (#1) and public email (#6) moved to part answered.
- **2026-07-28** Added a "for them to go fix" section (their listings) and a question to confirm the 2007 trading vs 2011 incorporation story.
- **2026-07-28** Founding year answered: **2007**. Site now says 19+ years (was showing a stale 18+).
- **2026-07-28** Contact page now lists all three county lines, so ask #1 is half answered: we
  still need to know which number leads everywhere else on the site.
- **2026-07-28** Created. Added photo/video asks and quick decisions surfaced by the media hunt.

*Key: ☐ open · ◐ partly handled · ☑ done*
