# WHAT I NEED FROM TRINITY

Things only Jason or Simone can answer or provide. Tick them off as they come in.

**Living document.** Last updated: 2026-08-12. Deeper detail: `PRE-LAUNCH-PUNCHLIST.md`,
`MEDIA-INVENTORY.md`, `LAUNCH-CHECKLIST.md`.

---

## 🆕 JASON'S VOICE UPDATE, 1 AUGUST (two messages, after the site went live)

**Read this before acting on the 29 July block below, it changes two things.**

### 1. He is rebuilding the Housecall Pro booking options himself. **This is his work, not ours.**
Barbara test booked a repair and it "still looks good". He wants the **package pricing taken out**
and replaced with four plain options a customer picks from:

| Option | Price he stated |
|---|---|
| Service call | **$149** |
| Garage door estimate, residential | **Free** |
| Commercial garage door estimate | (not stated) |
| Warranty call | (not stated) |

⚠️ **This softens, but does not cancel, his "no pricing" rule.** On 29 July he said *"I don't want to
scare people... they may just call around and say what are you charging."* He is not against all
pricing, he is against the **package menu**. A single flat service call price is a different thing,
and it is a genuine differentiator. **Our website copy still shows no prices.** Do not add $149 to
any page without asking him, because a price on a web page and a price inside a booking flow are
different commitments.

**Three things to put back to him:**
- 🔴 **$149 vs "no trip charge".** Their own HCP account reports a **$0 trip charge** in both zones
  (#25b). "No trip charge" and "$149 service call" sound contradictory to a customer. Which is it,
  and how should the site describe the two together?
- **Is the commercial estimate free too**, or priced? He said the residential one is free and did
  not say for commercial.
- **What is a warranty call and is it chargeable?** Presumably free within a warranty period, but
  that needs to be true before anyone books one.

**Bears on `LAUNCH-TODO` 6.9**, the deferred decision on whether online booking survives. If the
booking flow now offers four sensible options instead of a price list, keeping it is easier to
defend. Revisit 6.9 once he has made the change.

### 2. ⚠️ **The Saturday conflict (#4a) is STILL NOT ANSWERED.**
He mentioned Barbara's booking test and said *"doesn't matter, I know you guys asked me that
earlier"*, which is not an answer. The site still says **Monday to Friday**, which remains the safe
reading, because their API returns **242 booking windows over 21 days with zero on a Saturday**.
**Ask again, plainly: does he want Saturday added in Housecall Pro, yes or no?**

### 3. New opener brochures supplied, and a complaint about repeated photos.
Seven LiftMaster PDFs landed in `public/brochures/Aug-1/`. He also asked, about the site's photos:
*"a lot of repetitive pictures in there. Do you guys not have enough pictures?"* **We do.** The local
cache holds **1,281** of their own images. Both handled on our side, tracked in `LAUNCH-TODO.md`.

---

## 📞 DECIDED IN THE 29 JULY CALL (Simone, Lloyd, Jason by phone)

Transcript: `transcript/7-29-2026.md`. **Read this block before doing any more build work, two of
these reverse things already shipped.**

1. **The booking modal is out. A short custom lead form replaces it.** Jason chose "fill out the
   information, we call them back" over self service booking, explicitly to **keep pricing off the
   site**: *"I don't want to scare people... they may just call around and say what are you
   charging."* Housecall Pro's embed cannot be trimmed (its zip gate, service picker and pricing
   are one flow, take it or leave it), so we build our own.
   ⚠️ **CORRECTED 2026-08-01 against the transcript. The earlier version of this line was wrong and
   we shipped a field the client had asked us to remove.** It said "Fields, per Jason: first name,
   **last name**, phone, email, zip". Jason was not in that part of the call, he had answered other
   questions by phone that morning. **Simone and Lloyd settled the fields, and they dropped the last
   name.** Simone at 12:18: *"I don't know if we need their last name... Barbara, who answers the
   phones, gets these forms. Once she calls them, she can get the rest of these details. However,
   first name is required, phone number, email address, zip code is required. That's it."*
   **Actual agreed fields:** first name, phone, email, **zip**, plus a free text box for what the
   problem is, plus **an optional select for what they need** (Derrick proposed it at 12:28, *"a
   small section, a select about what they want, just not make it required"*, and it was agreed).
   **Zip was contested and kept:** Lloyd wanted only name, email and phone; Simone kept zip so the
   office does not spend time on a caller in Atlanta.
   **No pricing, no package picker.** This is Jason's constraint and it is about **price on screen**,
   not about asking which service. Lloyd's *"maybe we can skip this one"* at 14:00 referred to
   Housecall Pro's **package** picker, which carries prices, not to a plain service select.
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

## 🩸 FROM THE 12 AUGUST FORM INCIDENT

Background for the conversation is in `CLIENT-NOTES.md`, top section. These are the two things we
need FROM them as a result.

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 45 | **Access to add one rate limiting rule in their Cloudflare account** | The lead form now records every submission, which is the fix for what happened. That also means anyone hammering the form writes to the database, and the daily write allowance is shared with the real leads table, so a flood could take the form down. One rule at Cloudflare's edge stops that before it reaches us. We have a working API key but it has no permission for this area, confirmed 12 August. Either they add the rule, or they grant Zone WAF and Zone Settings permission on a token. **Free plan gives one rule: 10 second window, group by IP, match on path `/api/contact`.** | 🔴 **OPEN, and it gates finishing the protection** |
| 46 | **Ten minutes of a Florida attorney on the privacy policy** | Their policy promises, with no conditions, that anyone can ask them to delete their information. We now keep a record of every submission, so that promise has a second place to reach. It also says submissions are "sent to us by email and stored in our database", which is no longer the whole truth, and it states no retention period. None of this is urgent and no law forces it at their size, but it is their own promise and it should be one they can keep. Already flagged as **#12**, this raises its value. Detail in `postmortems/2026-08-12-turnstile-lead-loss/10-privacy-and-retention.md`. | 🟠 **OPEN, low urgency, cheap to fix** |

---

## 🔴 BLOCKS LAUNCH (site cannot go live without these)

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 1 | ~~Which phone number is the main one?~~ | **ANSWERED 2026-07-29: (813) 279-6785 confirmed primary by Jason.** The three county lines stay on the contact page. **He also said the 877 toll free number is not needed** ("I don't necessarily think we need it"), so drop it. Old note: Their own Housecall Pro account lists **(813) 279-6785** as the company number, which is what the site already uses everywhere. Contact page lists all three county lines. Just needs a yes from Jason. | ◐ |
| 2 | ~~What year did the business start?~~ | **ANSWERED 2026-07-28: 2007.** Now used sitewide, and the "years in business" figure is calculated from it so it can never go stale. | ☑ |
| 3 | ~~Confirm the address~~ | **ANSWERED 2026-07-28 from their own Housecall Pro record:** 18125 US-41, Suite 208, Lutz FL 33549. This is the address they dispatch from, so it is authoritative. Map coordinates captured too. | ☑ |
| 4 | ~~What are the real office hours?~~ | **ANSWERED 2026-07-29 (Simone, with Jason on the phone).** Booking windows are **8am to 4pm** in **two hour increments** (8 to 10, 10 to 12, and so on), last appointment 4 to 6. **Phones are answered until 9pm.** Closed Sunday. | ☑ |
| 4a | ✅ **ANSWERED BY THEIR OWN GOOGLE LISTING, 2026-08-10. Saturday is a contradiction they are already publishing.** | Their Business Profile export shows **all three Google listings say open Saturday 07:00 to 21:00** (Oldsmar to 19:00), closed Sunday. Housecall Pro still returns **242 booking windows over 21 days with zero on a Saturday**. So Google tells the public they are open Saturday while the booking system offers nothing. **The site still says Monday to Friday, which is the safe reading, and the schema follows Google.** **One question for Jason: are you open Saturday or not?** If yes, he adds Saturday windows in Housecall Pro and we publish it. If no, he should fix Saturday on all three Google listings, because that is where most customers look. | ☐ |
| 4b | ~~Is the "24/7" promise deliberate?~~ | **ANSWERED 2026-07-29.** Jason's reading: it means **the phone is answered**, not that they service around the clock. Simone gave the practical answer and the decision: **say "we answer the phones till 9pm"** rather than 24/7. Derrick confirmed the wording with her directly. **This changes roughly 30 places on the site plus the JSON-LD opening hours.** | ☑ |
| 5 | ~~Email account for website leads~~ | **RESOLVED 2026-07-29.** Simone supplied the Resend login on the call and the login was confirmed working. Leads go to **trinitygaragedoorservice@gmail.com**, which is **Barbara**, Jason's office person. Domain verification still to do. | ☑ |
| 5b | 🔴 **STILL OPEN. The licence question was not actually answered.** | Asked on the call. The answer given was about **coverage**, not licensing ("we work through all counties, Hillsborough, Pasco, Pinellas, Polk, Hernando, some of the Sarasota area"). That does not tell us whether **GD13010 / GDI-09484** are county or Florida state licences, or whether the **Pasco renewal due 30 Sept 2026** is filed. The site claims "licensed in Florida" on **25 pages**. **This is still the only item on the list with legal exposure. Ask Jason directly, not Simone.** | ☐ |
| 6 | ~~A public email address~~ | **ANSWERED 2026-07-29: `trinitygaragedoorservice@gmail.com`.** It is Barbara's inbox and Simone says it has always worked well. A domain address was not wanted. | ☑ |
| 6b | 🔴 **URGENT NOW. How far south do you actually go?** | Simone named **"some of the areas in the Sarasota area"** as served. Sarasota and Manatee are **not** in the 130 zip Housecall Pro zone the whole site is built from. **This stopped being theoretical on 2026-08-10:** we published a **North Manatee** page covering **Palmetto, Parrish and Ellenton** (zips 34221, 34219, 34222), and added those three zips to the "are you in our area?" checker. That is now a public promise. It is roughly **an hour each way** from Lutz. **Two things to confirm: (1) do you want that work, and (2) do you want Bradenton and Lakewood Ranch too, or is the Manatee River the line?** We deliberately stopped at the river. Jason offered to review a town list, so this is that list. 🆕 **ASKED 2026-08-11 in Derrick's email to Jason** ("I assumed you meant Northern Manatee... Let me know if that is correct!"). ⚠️ The email named **"North Bradenton"** as added; the site covers Palmetto, Parrish and Ellenton only. When Jason confirms, reconcile: either add north Bradenton zips (34205/34209 area) or tell him Bradenton stays call and ask. **Saturday (#4a) and the phone numbers (#41) were deliberately NOT in that email**, still unasked. | ☐ |
| 6c | ~~Does your licence cover Manatee County?~~ | ✅ **ANSWERED 2026-08-10 (Derrick): the licence covers all of Manatee.** The North Manatee page now carries the same licence line as every other city page. **#5b stays open** on whether GD13010 / GDI-09484 are county or state licences, but it no longer blocks Manatee work. Permit requirement for replacements there still applies. | ☑ |

---

## 🟠 NEEDED BEFORE WE GO PUBLIC

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 7 | ~~**Cloudflare account access**~~ | ✅ **DONE.** Access granted and used. Cloudflare Turnstile is live on the form with a real (non test) secret, and the site itself now runs on their Cloudflare account. | ☑ |
| 8 | ~~**Domain / DNS access**~~ | ✅ **DONE 2026-08-01.** trinitygaragedoorservice.com and www both serve the new site, via Worker routes rather than a nameserver change. ⚠️ **The nameserver switch itself is still not cleared** and is tracked separately at `LAUNCH-TODO` 5.7. | ☑ |
| 9 | **Confirm the numbers we quote** | Site says 12,000+ doors serviced, 4.9 stars, 6 cities. Are these true? (Years is now calculated from 2007, so that one is handled.) | ☐ |
| 10 | **Confirm brands they INSTALL vs only REPAIR** | We list install = Clopay, C.H.I., Hörmann, Amarr, LiftMaster. Everything else repair only. | ☐ |
| 11 | ~~**Mailing address for the privacy policy**~~ | ✅ **DONE 2026-08-04.** Used the Lutz suite, 18125 US-41 Ste 208, Lutz FL 33549, taken from their own Housecall Pro company record rather than asked for again. It is composed from `SITE.address` in the page, so it can never drift from the footer or the JSON-LD. | ☑ |
| 12 | **Have a lawyer glance at the privacy policy** | It is a solid starting template, not legal advice. | ☐ |
| 13 | ⚠️ **"Veteran owned" needs a real answer, and the honest one is awkward** | **PART ANSWERED 2026-07-29.** Jason's **son** is the veteran and works in the business. **Jason owns the company and is not a veteran.** The son suggested adding the badge because "it'll help". Simone is checking with a contact and said **leave it on for now**, and she will tell Jason if it is a problem. Worth being blunt with her: "veteran owned" normally means **owned** by a veteran, and misusing it on a contractor site is the kind of claim that draws complaints. 🆕 **2026-08-10, a useful data point:** their Google Business Profile export carries **no veteran owned attribute on any of the three listings**. Google has a specific "Veteran owned" business attribute and they have not set it. So the badge is currently a website only claim. | ◐ |
| 14 | **Which Facebook page is the real one?** | There are two. We are linking the LLC one. The other is an "Inc" page we could not open. | ☐ |
| 15 | **Confirm the 2007 story** | Did Jason start doing the work in 2007 and incorporate in 2011? If yes, everything is consistent and it is just a listings cleanup. If the business really began in 2011, the logo tagline needs rethinking. | ☐ |

---

## 🔎 FROM THEIR GOOGLE BUSINESS PROFILE (new, 2026-08-10)

We exported all three profiles. These are answers and problems that came straight out of it.

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 4c | 🆕 **You answer the phone from 7am. Can we say so?** | All three Google listings publish **07:00 to 21:00**, and a real Google review says *"I called them right at 7A.M. and spoke to a gentleman"*. The site only says "we answer the phones till 9pm", so **we are giving away the early start for free**. Competitors mostly advertise 8am. One word answer, then we add it to the copy. | ☐ |
| 41 | 🆕 🔴 **There are three Google listings, three addresses and two phone numbers we have never seen** | Not duplicates, three real storefronts: **Lutz** 18125 US Hwy 41 Ste 208 (598 reviews), **Tampa** 14056 N Florida Ave (84 reviews), **Oldsmar** 105 Dunbar Ave Ste H (24 reviews, opened Mar 2023). The Tampa listing's phone is **(813) 397-6104** and its text link is **(813) 731-8405**, and **neither appears anywhere on the website**. So Google sends calls to numbers we do not publish and cannot measure. **Which numbers should the site actually show?** | ☐ |
| 42 | 🆕 **108 of your reviews are on the wrong listings** | 706 reviews in total: 598 on Lutz, 84 on Tampa, 24 on Oldsmar. The website links to the Lutz one, so **108 real reviews are invisible to anyone arriving through the site**, and they do not count toward the 5.0 average people see. ⚠️ **Do not merge or rename anything during the domain move**, a listing can go into review and disappear for days. | ☐ |
| 43 | 🆕 **Two listings still say "20+ years" and one is nearly empty** | The Lutz description says *"20+ years servicing Tampa Bay"*, but the site says since 2007, which is 19. The **Oldsmar** description is one line. **Free fix, big surface:** these descriptions show in Google search results. Want us to rewrite all three to match the site? | ☐ |
| 44 | 🆕 **Your listings point at `http://`, not `https://`** | Lutz and Oldsmar both link to `http://www.trinitygaragedoorservice.com/`. That is an extra redirect hop on the single biggest source of traffic they have. **Also worth tagging the link** so Google Maps traffic shows up properly in analytics instead of looking like direct traffic. | ☐ |

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
| 19b | **The full size original of the new team photo, the one with Barbara in it** | The copy we were sent is 1537 pixels wide. The one it replaced was 2048. It looks good on the home page, but the About page stretches it right across the screen, and there the extra size would show. Low priority, the page looks fine today. | ☐ |

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
| 35 | ⏸️ **ON HOLD from 2026-08-04. Do not ask him yet.** Switch on the booking redirect in Housecall Pro (2 minutes, Jason only) | **On hold for one reason: online booking is switched off on the website, so there is nothing for this redirect to catch.** The website now counts leads from its own request forms instead, which is a better number anyway. **Nothing is lost.** The thank you page is still built and still live, and the moment booking goes back on, this ask goes straight back on the list. Original ask, kept word for word so it can be revived: *Housecall Pro does not tell a website when somebody finishes booking, so the one supported trick is to send them to a "thank you" page afterwards and count who lands on it. All Jason has to do is: **Settings → Online Booking → booking redirect**, and paste in `https://trinitygaragedoorservice.com/book-a-repair/thank-you/`. Nothing else changes for the customer, they just see a proper confirmation page instead of being left in the booking window.* | ⏸️ |
| 34b | 🔴 **If yes: Jason has to be on hand for one 5 minute test** | **This is the only thing standing between us and switching it on, and we cannot do it without him.** Housecall Pro has **no test mode** and **no way to delete a lead through the software we use**. So we create one obviously fake test lead (fake name, a 555 phone number that cannot ring anyone, notifications turned off), check it lands in his Job Inbox, and then **he deletes it himself in Housecall Pro**. Deleting is reversible and does not message anyone. **We can create it. We cannot remove it.** Also needed from him first: **a separate API key just for the website**, so it can be switched off without breaking anything the marketing company uses. | ☐ |

---

## 📊 TRACKING WHAT THE ADVERTISING BRINGS IN (new, 2026-08-04)

- [ ] **#38 · Jason and Simone · A yes or no. Are you happy for Google to see what a job is worth?**
      To let Google Ads work out which ads bring the *profitable* work rather than just the most
      form fills, we would send it the value of each finished job. That means the real money per job
      sits inside the Google Ads account, where anyone with access to it can see it, including any
      agency they work with now or later. **It is a business decision, not a technical one, and
      nothing has been sent.** If the answer is no, everything still works, Google just counts leads
      instead of pounds.

- [ ] **#39 · Jason · Turn on Housecall Pro webhooks.** My Apps, then All Apps, then Webhooks. Admin
      only, so it has to be him. We want `job.completed` and `invoice.paid`, and he needs to send us
      the signing secret it gives him. **Not urgent**, and only worth doing if #38 comes back yes.
      Without it we can still read the same information, just by asking their system every night
      rather than being told.

- [ ] **#40 · Barbara and whoever books the work · Keep filling in the lead source. Please pass on
      that this is being done well.** On the 93 invoices they were paid for in July it was filled in
      every single time. Before 2023 it was blank on nine jobs in ten. Every claim we can now make
      about which advertising works rests on that one dropdown, and it is the office, not the
      website, that fills it in.

- [ ] **#41 · Lloyd · Which Google Ads account is the live one?** There are two IDs in his tag
      container, `995017484` and `17056268955`. The conversion for the contact form is sitting on
      the second one and has never once fired, because it is watching for a WordPress page element
      this site has never had. Rebuilding it in the wrong account fixes nothing, so this answer
      comes first. Full detail in `EMAIL-LLOYD-CONVERSION-TRACKING.md`.

---

## 🟢 LATER (only when they want these features)

| # | Ask | Why it matters | Status |
|---|---|---|---|
| 26 | ~~Housecall Pro plan level~~ | **ANSWERED 2026-07-28: they are on MAX**, the top tier (about $299/month). We confirmed this because API access works, and that is MAX only. **They are already paying for more than they use.** | ☑ |
| 27 | **Google account access** | To turn on the "are you in our service area?" address checker. Costs about nothing to run. | ☐ |
| 28 | **Google Business Profile access** | **UNBLOCKED 2026-07-29.** Simone checked live on the call: **Jason is the owner on GMB, so he can add us directly.** No need to chase the unresponsive old guy. | ◐ |

---

## Changelog
- **2026-08-11 (2nd)** New team photo supplied, the frame Barbara is clearly in, and it is now live on the home page and the About page (both read the same file). Added **#19b**, a request for the full size original, because the copy sent is smaller than the one it replaced.
- **2026-08-04 (3rd)** Privacy policy placeholders filled from facts we already had, so #11 is closed and #7 and #8 ticked as done by the live site. #12, the lawyer glance, is the only privacy item left.
- **2026-08-04 (2nd)** Conversion tracking dive. Added #38 to #41: the job value disclosure decision, Housecall Pro webhooks, praise for the office's lead source discipline, and the two Google Ads accounts question for Lloyd.
- **2026-08-04** Online booking switched off on the website at the client's request, and every
  booking button now goes to a request form. **#35 put on hold**, because there is no booking left
  for that redirect to catch. It is paused, not dropped, and comes straight back if booking does.
- **2026-08-01** Jason voice update after go live. He is rebuilding the **Housecall Pro booking
  options himself**: package pricing out, replaced by service call **$149**, free residential
  estimate, commercial estimate and a warranty call. Raised three follow ups, the sharpest being
  **$149 vs the $0 trip charge** their own system reports. **#4a Saturday is still unanswered**, he
  deflected it. New LiftMaster opener brochures supplied, and he asked why the site repeats photos.
- **2026-08-11** Recap email sent to Jason (his rewrite of our draft). **#6b formally asked**, with a wording gap to reconcile on reply ("North Bradenton"). #4a and #41 held back on purpose, one question per email.
- **2026-08-10** **#6c answered: the licence covers all of Manatee** (Derrick). Licence line restored on the North Manatee page. #5b (county vs state) still open.
- **2026-08-10** **Google Business Profile export analysed in full.** Answered **#4a (Saturday)** from their own listings, added **#4c, #41, #42, #43, #44**, and gave **#13** a hard data point. Fixed the rating and count sitewide to **5.0 from 598**, corrected the schema open time to **07:00**, and identified the phantom call tracking number in `GTM-NOTES.md`.
- **2026-08-10** **North Manatee service area page published** (Palmetto, Parrish, Ellenton). This is the first service area on the site that is NOT from their Housecall Pro zone, so **#6b became urgent** and a new **#6c** was added on whether their licence covers a sixth county. Google Business Profile access came through and the Takeout export landed: **706 reviews across three listings**, not 598. Two findings from it are in `CLIENT-NOTES`.
- **2026-07-31** Blog media cleaned up. **#24b done**, all three AI images replaced with real job photos. **#24 sharpened**, we can now name the two Shutterstock files. Blog images went from 21 MB to 1.8 MB.
- **2026-07-29** Client call. Answered #1, #4, #4b, #5, #6, #29, #30, #36. Raised **#4a (Saturday booking conflict, verified against their API)** and **#6b (Sarasota)**. #5b licences **still open**, the answer given was about coverage not licensing. #13 veteran owned became more delicate, not less. Direction changes recorded at the top.
- **2026-07-28** Booking thank you page built and live. Added #35 (Jason points HCP's booking redirect at it) and #36 (turn on analytics, recommend Cloudflare Web Analytics). Without both, bookings stay uncountable.
- **2026-07-28** Service areas section redesign planned (`SERVICE-AREA-REDESIGN.md`). Added #25b, whether we can advertise the $0 trip charge their own system reports.
- **2026-07-28** Housecall Pro keys tested and working. Added asks 29 to 34. **Address (#3) answered** from their own HCP record, **plan level (#26) answered (MAX)**, phone (#1) and public email (#6) moved to part answered.
- **2026-07-28** Added a "for them to go fix" section (their listings) and a question to confirm the 2007 trading vs 2011 incorporation story.
- **2026-07-28** Founding year answered: **2007**. Site now says 19+ years (was showing a stale 18+).
- **2026-07-28** Contact page now lists all three county lines, so ask #1 is half answered: we
  still need to know which number leads everywhere else on the site.
- **2026-08-12** Added the form incident section: #45 Cloudflare rate limiting access, which gates
  finishing the protection, and #46 the privacy policy review, which raises the value of #12.
- **2026-07-28** Created. Added photo/video asks and quick decisions surfaced by the media hunt.

*Key: ☐ open · ◐ partly handled · ☑ done · ⏸️ on hold, paused for now, not dropped*
