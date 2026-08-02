# WHAT TO TELL TRINITY

Talking points for client meetings. Wins to share, problems to raise, and advice worth giving.

**Living document.** Last updated: 2026-07-28. Deeper detail: `MEDIA-INVENTORY.md`,
`PRE-LAUNCH-PUNCHLIST.md`, `INTEGRATIONS` notes in `CLAUDE.md`.

---

## 🔎 FROM THE 2 AUGUST PHOTO AUDIT (we reviewed 1,281 of their own images)

Jason asked *"do you not have enough pictures?"*. **We have plenty.** Reviewing them turned up five
things he should hear, in order of how much they matter.

1. 🔴 **There is a marketing graphic with FABRICATED testimonials.** It is laid out like Twitter
   posts, with invented names, invented handles, blue verified ticks and stock avatars. It is not on
   the new website and never will be, but if it is still running on social it is a real credibility
   risk, and inventing reviews is the kind of thing that draws complaints. **Worth him knowing
   quietly.**
2. 🔴 **Several graphics use STOCK MODELS presented as if they were Trinity people**, and one uses a
   stock house that is visibly not Florida. Same category of problem as the AI blog images we
   already replaced, and it came from the same place, the previous marketing vendor.
3. 🟠 **The phone numbers on their own assets contradict the site.** The truck livery shows the
   Hillsborough line, several graphics carry all three county numbers, and one carries an 877 number
   that appears nowhere else. Jason already said the 877 is dead. **The truck wrap number is legible
   at full size in the best truck photo we have**, so if we publish it, someone will notice the
   mismatch. Not urgent, but it feeds the same "consistent details" point as the Yelp and BBB dates.
4. 🟠 **One good photo shows a customer's face** and would need his permission before we publish it.
   Everyone else in the set is staff, which is fine.
5. **The real problem behind his complaint: only about 20 of these are actual photographs of work.**
   The rest are designed graphics. And of the genuine photos, most were shot on a phone, in portrait,
   inside a dim garage, looking upward. **That is why the pages feel repetitive even where the files
   differ.** One proper shoot exists (the studio portrait of Jason, the team behind the banner, the
   technician portraits) and it is noticeably better than everything else.

**The ask that would fix this permanently:** next time a crew is on an interesting job, ask them for
**five landscape photos**, taken a step back, in daylight, showing the specific part being worked on.
Springs, an opener, a door off its track, cables. That is fifteen minutes of a technician's time and
it would be worth more than everything in the archive.

---

## ✅ GOOD NEWS TO LEAD WITH

- **The new site is built and you can see it today.**
  https://trinity-garage-door.derrick-2fd.workers.dev
- **Online booking works.** Every "Book a Repair" button now opens their real Housecall Pro
  scheduler.
- **Their photos are all real now.** The old site had an **AI generated fake photo of Jason** on it.
  It is gone, replaced with his real studio portrait.
- **We found 284 unused real photos** sitting in their own website's library that they were not
  using anywhere. Their best work was invisible.
- **Before and after photos now exist.** Their archive had them stuck together as single images.
  We separated them, so the site can show genuine before/after pairs.
- **Everything is faster and cheaper to run.** The whole site is static, so hosting is pennies.

---

## ⚠️ PROBLEMS THEY SHOULD KNOW ABOUT

### Their phone numbers are a mess
There are **nine different numbers** for them across the internet. Their trucks show one number,
their website shows another, their BBB listing shows a third. Google only knows one.
**Why it matters:** Google rewards businesses whose details match everywhere. Right now theirs
do not, and it is costing them local search ranking.

### Their hours do not match
Google says Mon to Sat, 7am to 9pm. Their own front door says Mon to Fri, 8am to 5:30pm.
**Why it matters:** Customers see the Google one. If it is wrong, people show up or call at the
wrong time.

### They have duplicate listings
There are **two Yelp pages** and **two Facebook pages** for the business.
**Why it matters:** Reviews and traffic get split between them. They should claim and merge the
duplicates. This is free and takes a phone call.

### Their start date says something different in four places
**Decided: the website uses 2007.** That is settled and live. But the rest of the internet does
not agree, and that is worth a two minute conversation.

| Where | What it says |
|---|---|
| Their logo, trucks and website | **2007** |
| Yelp ("Established in") | **2010** |
| BBB ("Business started") | **2011** |
| Florida state records (Sunbiz) | **2011** (incorporated) |
| Angi ("16 years of experience") | implies about **2010** |

**The likely explanation, and it is a perfectly normal one:** Jason started doing the work in
2007, and formally incorporated the company in 2011. Those are two different facts, and both can
be true. "Opening Doors Since 2007" is about when they started serving customers.

**Why it matters:**
1. **Google cross-checks business details across directories.** When the same business reports
   different facts in different places, it weakens confidence in the listing, and local search
   ranking is built on exactly that kind of consistency.
2. **A customer can see it.** Someone who reads "Since 2007" on the site and then finds "Business
   started 2011" on BBB may read it as a stretch, even though it is not.

**What to do:**
- **Update the "established" field on Yelp and BBB to 2007.** They control both. This is the fix.
- **Leave the state record alone.** Sunbiz is a legal record of *incorporation*, it is not wrong
  and should not be changed. It is answering a different question.
- **Fix the Angi "years of experience"** number while they are in there.

**Ask Jason to confirm the story:** did he start trading in 2007 and incorporate in 2011? If so
everything above holds and it is a simple listings cleanup. If the business genuinely began in
2011, we should change the logo tagline and the site, which is a bigger conversation.

### An outside marketing company has full access to their customer list
**Raise this calmly. It is a housekeeping problem, not a scandal.**

Their Housecall Pro account has two API keys. One is labelled for **Drive Social Media**, a
marketing agency. We tested it. It opens the whole account.

That means whoever holds it can read:
- All **6,001 customer records**, with home addresses, phone numbers and emails
- All **8,211 invoices**, with the amounts
- Their staff's **personal calendar entries**. We saw medical appointments and family
  commitments belonging to named employees.

Three things make this worth fixing:
1. Housecall Pro only offers "full access" or "read only". There is no way to give someone just
   the marketing numbers.
2. **Read only still sees everything.** It only stops them changing things.
3. **Housecall Pro keeps no record of who used a key or when.** If they ever wanted to check, they
   could not.

**Drive Social Media is a real, established agency** (about 200 to 500 staff, Inc. 5000 listed,
A+ with the BBB). Nothing suggests they have done anything wrong. This is about the door being
wider than the job needs.

**What to ask Jason:**
- Is Drive Social still working with you? If not, delete that key. Access does not expire.
- If they are, ask them to switch to read only.
- Make a separate key for the website, so one can be turned off without breaking the other.

### They are paying for the most expensive plan
Housecall Pro's **MAX** plan is about **$299 a month**. We can prove they are on it, because the
part of the system we tested only works on MAX.

**Why it matters:** MAX includes advanced reporting, full system access and several tools that
cost extra on lower plans. If they are not using those, they are paying roughly **$150 a month
more than the middle plan** for features sitting idle. Either start using them or drop a tier.

**One thing this does save them:** we no longer need Zapier or any other connector to push website
leads into their system. That is included.

### Three blog pictures were made by AI, and the files admit it
Their old blog used AI generated images. Three are still on the site, and the picture files carry
a **hidden tag naming the AI that made them**. Google, Facebook and LinkedIn can read that tag and
put an "AI generated" label on it.

One of them is the **first picture anyone sees** when they open the blog.

**Why it matters:** the site tells people "no stock photos, no catalog renders" on the portfolio
page. And we already took an AI photo of Jason off the site for the same reason. **This is not
something we added, it came across from the old website.**

**Easy fix:** they have hundreds of real job photos. We swap three pictures and it is done.

### The blog is very slow on a phone
The blog page sends **21 MB of pictures**. On a phone on cellular that is a bad experience, and
Google measures it.

**Why it matters:** it is fixable in an afternoon, and it is the slowest page on an otherwise very
fast site.

### Two blog posts were advertising expired deals
Old posts still promoted "$50 off springs" and an "August Special, 10% off". We removed the
offers and kept the articles.
**Why it matters:** Customers hold you to advertised prices.

---

## 💡 ADVICE WORTH GIVING

### 1. Google Business Profile is their biggest free lever
They already have **5.0 stars from 597 reviews.** That is outstanding and it is their single
strongest asset. Most local customers never reach the website, they call straight from Google Maps.
**Action:** claim it fully, keep the details accurate, post to it, reply to every review.

### 2. Do not buy marketing software they already own
Housecall Pro **already does** review requests, customer texting, email marketing, postcards,
invoicing, card payments and financing.
**Action:** do not let anyone sell them Podium, Birdeye, Mailchimp or a separate payment system.
Just switch on what they are already paying for.

### 3. They serve a much bigger area than their website admits
**This is probably the biggest growth item on the list.**

Their own Housecall Pro service area covers **130 zip codes, five counties and 41 towns**:
Hillsborough, Pinellas, Pasco, Hernando and part of Polk. Their trip charge is **$0**.

The website has pages for **six towns**. So **35 towns they already drive to are invisible.**

The biggest ones missing:

| Town | Roughly |
|---|---|
| St. Petersburg | 357,000 people |
| Clearwater | 183,000 |
| Lakeland | 161,000 |
| Spring Hill | 115,000 |
| Largo | 106,000 |
| Brandon | 97,000 |
| Riverview | 92,000 |

**Why it matters:** people search "garage door repair" plus their own town. If the page never
names the town, it will not come up. Spring Hill and Largo in particular are full of older
single family homes, which is exactly where repair work comes from. Riverview and Wesley Chapel
are full of new build homes, which is where installs come from.

**Action:** confirm the list is current, then add pages for the biggest towns. Nothing to buy,
and no new area to cover. They already go there.

**We checked where their trucks actually go**, using 1,198 recent jobs from their own system. The
six towns with pages cover five of their top six markets, so whoever chose them chose well. But
these towns have **no page at all**:

| Town | Share of their recent work |
|---|---|
| New Port Richey | **4.6%** |
| Zephyrhills | 3.3% |
| Odessa | 3.3% |
| **Trinity** | **3.0%** |
| Clearwater | 2.6% |
| St Petersburg | 2.5% |

**The one to point at in the meeting: they do 3% of their work in a town called Trinity, the
company is called Trinity Garage Door Service, and there is no page for it.**

Worth knowing the other way too: **Oldsmar has a page but is only their 15th busiest town.**

### 4. What their competitors are doing, and where the gaps are
We looked at eight garage door companies, including their biggest local rival.

**Banko Overhead Doors is out-covering them badly.** Banko has a page for **150+ towns across 12
Florida counties**. Trinity has **six**. Banko is not just defending Tampa, they are going after
the whole corridor.

**But in Hernando County, Spring Hill and Brooksville, the local competitor's website is barely
functional.** Static pages from an old website builder, no booking, no blog, and two menu links
that go to the same page by mistake. Trinity already serves that area. It is the easiest market
on the board to take.

**Four things almost nobody in the industry has, that Trinity could:**

| Thing | Who has it |
|---|---|
| Real Google reviews showing live on the site | **Nobody.** Every competitor uses a screenshot, a link, or a broken widget. Trinity has 5.0 from 597 |
| Named technicians with photos | **Nobody.** Everyone says "background checked" without naming a soul. Trinity has real names and real photos already |
| "Veteran owned" | **Nobody claims it.** Several offer a military discount. **Is it true for Trinity?** |
| An actual price on the website | Only one of eight. The biggest national company says outright it will not publish prices |

**Also worth knowing:** every competitor's "design your door" tool we tested was **broken or
missing**. And the industry trade body (the International Door Association) runs a "find a
verified dealer" directory that only one of the eight competitors uses. Both are cheap wins.

### 5. The cheapest way to buy leads in their trade
**Google Local Services Ads.** You pay per lead, the ads sit above everything else, and for garage
door companies leads average around **$49** versus about **$145** on regular Google Ads.
It runs off their Google profile and needs no website work.

### 6. They cannot tell which advertising works
**There is still no analytics of any kind on the website. Not one line of it, confirmed 2026-07-28.**
So right now nobody can answer the most basic question about the rebuild: did it bring in any work?
That is uncomfortable given **1 of their 300 most recent jobs** came from the website.

This has become concrete rather than theoretical. We have just built the **booking thank you page**,
which is the only supported way to know somebody finished booking. Without analytics it can only be
counted roughly, from server traffic. With analytics it becomes a real number.

**Action, in order:**
1. **Turn on Cloudflare Web Analytics. It is free, and the site already runs on Cloudflare.** No
   cookies, no consent banner, no speed cost, and it counts visits per page, which is exactly what
   the thank you page needs. This is a one line change for us.
2. **Jason points Housecall Pro's booking redirect at that page** (`CLIENT-ASKS` #35). Two minutes
   in his settings, and it is what turns bookings into a countable number.
3. **Call tracking** (about $30/month) if they start spending on ads. Phone calls are how this
   business converts, so untracked calls means untracked money. Housecall Pro sells numbers too.

⚠️ **One honest caveat to mention:** the privacy policy currently promises *"if we add website
analytics or advertising tools in the future, we will update this policy to describe them."* So
switching analytics on means we update that page the same day. Not a blocker, just do not let it be
forgotten.

### 7. Accessibility is a real legal risk
Small businesses get sued over inaccessible websites. About 3,100 federal cases in 2025, usually
starting with a $10,000 to $25,000 demand letter.
**Action:** we have already fixed the contrast problems. Do **not** let anyone sell them an
"accessibility widget", those are actively targeted by the people filing the lawsuits.

### 8. Their old website links will not break
Every old page address will forward to the matching new one automatically.
**Why it matters:** they keep their Google ranking and any links other sites point at them.

---

## 📸 WHAT WOULD MAKE THE SITE LOOK BETTER

Ranked by impact.

1. **The original video files.** The homepage uses video and the only copies we could find are low
   quality. This is the biggest single visual improvement available.
2. **Tell us which town each job photo is from.** We have hundreds of great job photos but cannot
   place them geographically, so the city pages use generic images.
3. **Photos of commercial work.** They sell commercial doors but we found none.

---

## 🗒️ SMALLER THINGS WORTH MENTIONING

- Their Angi profile says **"veteran owned and operated"** but their website never mentions it.
  If true, that is a strong trust signal they are wasting.
- Their team photos are excellent and named: **Andre, David, Joey, Jonah**, plus office staff.
  We could add a "meet the team" section if they want one.
- Some of their Instagram posts use **AI generated cartoon versions of their staff**. We avoided
  those. Worth knowing that real photos always outperform them.
- The old website had **229 images with no description tags**, which hurt both accessibility and
  Google. The new one is clean.
- Customer photos on Google and Yelp belong to the customer, not to Trinity, so we cannot reuse
  them on the website without permission.

---

## Changelog
- **2026-07-28** Full project audit. Added: three AI generated blog pictures (inherited from the old site), the 21 MB slow blog page, and a competitor comparison across eight companies.
- **2026-07-28** Tested their Housecall Pro keys. Added three items: the outside agency with full access to the customer list, the fact they are on the $299 MAX plan, and the service area being far bigger than the site says.
- **2026-07-28** Rewrote the founding-year item: 2007 is decided and live, so it is now about the four sources disagreeing and what to fix on Yelp/BBB/Angi.
- **2026-07-28** Created. Added findings from the media hunt: AI photo replaced, phone/hours
  conflicts, duplicate listings, expired blog offers.
