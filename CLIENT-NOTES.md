# WHAT TO TELL TRINITY

Talking points for client meetings. Wins to share, problems to raise, and advice worth giving.

**Living document.** Last updated: 2026-08-12. Deeper detail: `MEDIA-INVENTORY.md`,
`PRE-LAUNCH-PUNCHLIST.md`, `INTEGRATIONS` notes in `CLAUDE.md`.

---
---

## 🩸 JASON WAS RIGHT ABOUT THE FORM, AND IT WAS OUR FAULT (12 AUGUST)

**Lead with this one, and lead with the apology.** Full detail in
`postmortems/2026-08-12-turnstile-lead-loss/`.

### What to say

He emailed twice about a customer saying the form came back. He was right both times, and the
cause was a change we made on 3 August.

A homeowner in Wesley Chapel clicked one of their Google ads, read the page about his own town,
and tried to send a repair request **six times over eleven hours**. Every attempt was turned away
by our spam check. Twice at about 9:40 that night, three times two minutes later, and once more at
7:12 the next morning. His second email landed four minutes after that last attempt.

**We cannot get that customer back.** Our own system threw his details away as it turned him down,
so there is no name and no number on our side. **The voicemail on Jason's phone is the only way to
reach him**, and someone chasing a garage door at ten at night is worth the call.

### The part that is bigger than one customer

It was not only him. For nine days, roughly **a third of the people who got as far as the spam
check could not get past it**. Nobody could tell, because a refused request left no record
anywhere. The only alarm in the whole system was a customer picking up the phone.

### What is fixed, as of today

- The fault itself. Clicking from one form page to another used to quietly break the spam check.
- **We no longer throw anything away.** Every submission is now saved before any check runs, spam
  included. If it is a real person we can call them back.
- **A refused customer now gets told the truth on screen**, that we have their details and someone
  will ring. The old message said "refresh and try again", which wiped everything they had typed.
  That is what this customer followed, three more times.
- **We get an email the moment anyone is refused**, with their name and number in the subject.
- The spam check was also loosened so it stops interrupting people.

### If Jason asks why it happened

Straight answer: on 3 August we tightened the form to stop spam getting through, which was a real
problem and the right thing to do. We did not measure how many real customers that tightening
would turn away, and we had no way to see it afterwards. Both are fixed now. That is the honest
version and it is better than a technical one.

### One thing to ask him for

A small setting needs changing in their Cloudflare account to finish the protection. We do not have
access to that part. See `CLIENT-ASKS`.

---

## 📧 CUSTOMERS NOW GET AN EMAIL WHEN THEY FILL THE FORM IN (12 AUGUST)

**This is new and worth telling them, because it changes what their customers experience.**

Until today the website sent the customer nothing at all. They filled the form in, saw a thank you
page for a few seconds, and then had no proof any of it happened. The only email went to the office.

Now anyone who submits gets a short email straight away. It opens with their name, thanks them,
says a real person will be in contact as soon as possible, shows the phone number, and reads their
own details back to them. There is a photo of one of the crew at the top with the logo and the
phone number across the back of the shirt.

**Three reasons this matters more than it looks:**

1. **It reassures the customer.** Somebody who has just typed their phone number into a website has
   no idea whether it worked. Now they have something in their inbox that says it did, with a
   number to call if they want somebody sooner.
2. **It catches their own typos.** The email shows them the phone number they gave us. A wrong digit
   is the most common way a real enquiry goes cold, and the customer is the only person who can spot
   it. The email tells them where to write to fix it.
3. **It is an early warning if the form ever breaks again.** A customer who expects an email and
   does not get one has a reason to call and say so. That is exactly the situation last week, where
   the only reason anybody found out was Jason chasing a voicemail twice.

**What it does not do**, and Jason may ask: it does not promise a time, a price, or an arrival
window, because those are not ours to promise before the office has spoken to them. It does not
text anybody. And it is only sent when the form actually goes through, never to somebody the spam
check turned away.

---

## 🗓️ THE REVIEWS SECTION IS NOW A SCROLLING WALL (10 AUGUST)

**Jason asked for "a lot more" reviews on the site. Done.** The homepage used to show four. It now
shows **60 real Google reviews** on three rows that scroll continuously in alternating directions,
so the page reads as a company with a lot of happy customers rather than four quotes.

Every one is **verbatim from their own Google profile**, pulled from the official export. Nothing
was written, shortened or tidied.

### One thing to put back to Jason, gently

He said **"we have around or over 1k online"**. His three Google listings hold **706**, of which 593
have any text written. He is very probably right about "online" in the wider sense once Yelp, Angi,
BBB, Facebook and Nextdoor are counted, but **Google alone is not 1,000**.

**The site says "5.0 from 598 and counting"**, which is the number on the Lutz listing the site
links to, so anyone who clicks can check it in one second. That is the number we can defend. If he
wants a bigger figure on the page, the honest version is an all platforms total, and we would need
him to confirm the counts on the other sites first.

Worth pairing with **#42**: 108 of those 706 are stranded on the Tampa and Oldsmar listings. Getting
those consolidated would raise the number people actually see on the listing the site points at.

## 🗓️ GOOGLE BUSINESS PROFILE ACCESS, AND WHAT IT SHOWED (10 AUGUST)

Jason granted access to all three profiles. We exported the data the same day. Three things to tell them.

### 1. They have 706 reviews, not 598. About 108 are on the wrong listings.
There are **three** Business Profiles, and all three carry real reviews:

| Listing | Reviews |
|---|---|
| Trinity Garage Door Service **- Lutz** (the main one, the one the website links to) | **598** |
| A second listing | **84** |
| A third listing | **24** |

Every review is unique, so this is not double counting. **108 real reviews are sitting on profiles
that almost nobody sees**, and they do not count toward the 5.0 average customers look at. Two of
the three listings also have a town stuck in the business name, which is against Google's naming
rules and is a suspension risk. Worth Jason's attention, but **changing a listing name can put it
into review, so do not touch it during the domain move.**

### 2. The plan to build town pages from their reviews does not work, and we should say so.
We had planned to read all their reviews, find the ones that mention a town, and put a real local
review on each new town page. **Now that we have all 706, that plan is dead.** Only **8 reviews out
of 593 with any text mention a town at all**, and they only cover Lutz, Tampa, Land O' Lakes and
Wesley Chapel, which already have pages. Customers just do not write where they live.

**This is not a problem with the reviews, it is a problem with the plan.** Collecting more reviews
will not change it. If they want town pages for New Port Richey, Zephyrhills, Odessa or Trinity, the
honest options are: ask a few recent customers in those towns for a review that mentions the town,
or build the pages without a local quote. **Recommend asking the office to note the town when they
request a review.** That costs nothing and fixes it going forward.

### 3. The rating on the site is slightly out of date.
Google now shows **5.0 from 598**. The site says 597 in the bar under the header, and one older
figure of 4.9 is still sitting in the code where nothing reads it. Small, worth a tidy up.

---

## 🗓️ NORTH MANATEE PAGE IS LIVE (10 AUGUST)

New service area page for **Palmetto, Parrish and Ellenton**, the three zip codes north of the
Manatee River. Their zip checker now answers yes for 34221, 34219 and 34222, and the map on the
service areas page has grown to match.

**Be straight with them about what this is.** Every other town on the site came from their own
Housecall Pro service zone. **Manatee did not.** So this page is a business decision to go after new
work, not a description of work they already do.

⚠️ **Updated 10 August, and the evidence got stronger.** Their Google Business Profile export
settles it. The Tampa listing declares its service area as exactly **five counties: Polk, Pasco,
Hernando, Pinellas and Hillsborough.** The Oldsmar listing names ten towns, all Pinellas and north
Hillsborough. The Lutz listing names three towns. **Manatee appears nowhere. Neither does Sarasota.**

That is now **three independent sources agreeing**: their booking system, what Jason said on the
call, and the service area they publish to Google themselves. **Nothing anywhere says they work
Manatee.** The page is still a reasonable bet on new work, but it should be presented to them as a
bet, and #6b should be answered before it is promoted.

**Two questions back to them, both in `CLIENT-ASKS` (#6b and #6c):**
1. **Do they want it?** It is about an hour each way from Lutz.
2. ~~Does their licence cover Manatee?~~ **Answered 10 August: yes, it covers all of Manatee**,
   so the page now carries the licence line like every other town page. Still worth knowing:
   Manatee requires a permit for a garage door replacement, tied to a Florida Product Approval.

We deliberately stopped at the Manatee River and left Bradenton and Lakewood Ranch out, so the site
does not promise more than they have agreed to.

---

## 🗓️ ONLINE BOOKING IS OFF, AND THE FORMS TOOK ITS PLACE (4 AUGUST)

Jason asked for Housecall Pro's online booking to come off the website. **It is off.** Nothing was
thrown away, so if he wants it back later it is one setting on our side and it returns as it was.

**What replaced it.** Every button that used to open the booking window now goes to a short request
form. It is the same form everywhere, the same fields, and it still reaches Barbara's inbox the same
way. What changed is that there is now **one form page per job**: springs, openers, a door off the
track, cables and rollers, a tune up, a replacement, an emergency, and a general repair one. One
form, several doors into it.

**Two things this gives the office that the booking window never could.**

1. **They can see which page the customer came from.** The lead email now has a line saying "Came
   from spring repair" or "Came from off track", so whoever picks up the phone already knows what
   the customer was reading a second before they filled it in.
2. **The lead email now shows the customer's zip.** It was always being collected and the office
   never saw it. Simone kept that field for exactly this reason, so nobody spends twenty minutes on
   a caller in Atlanta. Now it is right there in the email.

Over time this also answers the question nobody could answer before: **which parts of the website
actually bring in work.**

---

## 📬 LEADS NOW GO STRAIGHT TO THE OFFICE (4 AUGUST)

**The form is handed over.** Every submission now emails **both** office addresses,
`babs.trinitygaragedoorservice@gmail.com` and `trinitygaragedoorservice@gmail.com`, at the same
time. Nobody has to forward anything to anybody.

Each email carries the customer's name, phone as a tap to call link, email, **zip**, what they said
they need, their message, and a **"Came from"** line naming the exact page they filled it in on.

Derrick stays on a silent copy for a few weeks to make sure nothing goes missing in the handover.
It is a blind copy on purpose, so his address never shows up in the office's reply chain with a
customer.

**Worth saying out loud to them:** if a lead ever seems to be missing, check the spam folder first
and mark it "not spam". Gmail decides that on its own the first few times a new sender writes, and
the fix is one click that teaches it permanently.

---

## 🛡️ SPAM ON THE FORM, FOUND AND FIXED (3 AUGUST)

**One spam submission reached the form.** It never reached Trinity, because at the time leads were
still going only to Derrick during the testing window. It was a marketing solicitation with a
California area code and a throwaway email address.

⚠️ **That testing window closed on 4 August.** Leads now go straight to the office, so a spam
submission would land in front of Barbara rather than being caught first. The hole it came through
is closed and was verified from the outside six ways, but it is worth them knowing that the safety
net of "Derrick sees everything first" is gone by design.

**The cause, in plain terms.** The form has always had Cloudflare's bot check on it. But the code
had a deliberate escape hatch: if the bot check did not run at all, the submission was let through
anyway, so that somebody with an aggressive ad blocker could still reach us. A spammer simply
skipped the check entirely and walked through that gap. Cloudflare's own dashboard had been warning
about this and it was right.

**Now closed**, and verified from the outside in six different ways. A real submission from a real
browser still goes through, tested twice.

⚠️ **ONE THING TO WATCH IF ANYONE EVER ADDS A COOKIE BANNER.** The common WordPress consent tools
block Cloudflare's bot check by default, filing it under "statistics". Adding a banner without
allowlisting it would break the contact form completely. That is a far more likely way to lose leads
than any ad blocker. **If a cookie banner is ever proposed, tell us first.**

Worth knowing: the ad blocker worry that created the gap turned out to be mostly myth. The main
blocker lists deliberately allow Cloudflare's checker through, because blocking it breaks logins all
over the web.

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
- **Every button now asks for the job in one short form.** Online booking came off on 4 August at
  Jason's request, and the buttons go to a request form instead. See the note at the top of this
  page for what that buys them.
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

### 6. We can now tell which advertising works, and the answer is better than we thought
**Rewritten 2026-08-04. The old version of this section said there was no analytics at all and that
the website had produced one job. Both were out of date.** Tracking went live 29 July, and we have
since measured their real numbers.

**Good news to lead with. The website brings in few jobs, but big ones.** Twelve jobs all time carry
the website as their source, ten of them finished, and eleven of the twelve happened this year. They
came to **$23,298**, an average of **$2,330 a job**, which is roughly two and a half times their
usual ticket.

**Their own record keeping is what made this measurable, and it is worth telling them so.** Before
2023, nine jobs in ten had no source recorded. On the 93 invoices they were paid for in July, it was
**one hundred percent filled in**. That is the office doing something right, and everything below
depends on them carrying on.

**Where July's $149,800 actually came from:**

| Where the work came from | Jobs | Paid |
|---|---|---|
| Repeat customers | 43 | $80,264 |
| Google Maps | 14 | $15,431 |
| Google (search) | 6 | $23,051 |
| Google Ads | 6 | $5,674 |
| Angi | 4 | $5,259 |
| Nine other sources | 20 | $20,119 |

**The honest read: the phone is the business.** Nearly half their money is repeat customers ringing
a number they already have. That is why the next thing worth doing is measuring calls properly, not
polishing form tracking.

**What we shipped on 4 August:** every form now records which ad brought the person, and the office
email says which page they filled it in on. Nothing was being recorded before, and an ad click
cannot be recovered after the fact, so this was the one piece that had to happen now rather than
later.

This has become concrete rather than theoretical. We have just built the **booking thank you page**,
which is the only supported way to know somebody finished booking. Without analytics it can only be
counted roughly, from server traffic. With analytics it becomes a real number.

**Action, in order:**
1. **Turn on Cloudflare Web Analytics. It is free, and the site already runs on Cloudflare.** No
   cookies, no consent banner, no speed cost, and it counts visits per page, which is exactly what
   the thank you page needs. This is a one line change for us.
2. ⏸️ **ON HOLD since 4 August, do not ask him for this yet.** This step was Jason pointing
   Housecall Pro's booking redirect at that page (`CLIENT-ASKS` #35). **Online booking is off now, so
   there is nothing left for it to catch.** The request forms count themselves instead, which is the
   better number. This goes straight back on the list the day booking returns.
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
- **2026-08-04 (2nd)** Rewrote section 6. The old "no analytics at all, one job from the website" line was out of date. Replaced with the measured numbers: 12 website jobs at $2,330 average, and July's $149,800 broken down by where it came from.
- **2026-08-12** Customers now get an acknowledgement email when they submit a form. Added the
  section explaining what it says, why it also acts as an early warning, and what it deliberately
  does not promise.
- **2026-08-12** The form incident. Added the section at the top: Jason was right, it was our
  change on 3 August, one customer is unrecoverable and his voicemail is the only route back to
  him, and roughly a third of challenged visitors were affected for nine days. Also what is fixed
  and the one thing we need from their Cloudflare account.
- **2026-08-04** Online booking switched off at Jason's request and replaced by request forms, one
  per job. Added the note at the top, corrected the "online booking works" line, and put step 2 of
  the measurement plan on hold along with `CLIENT-ASKS` #35.
- **2026-07-28** Full project audit. Added: three AI generated blog pictures (inherited from the old site), the 21 MB slow blog page, and a competitor comparison across eight companies.
- **2026-07-28** Tested their Housecall Pro keys. Added three items: the outside agency with full access to the customer list, the fact they are on the $299 MAX plan, and the service area being far bigger than the site says.
- **2026-07-28** Rewrote the founding-year item: 2007 is decided and live, so it is now about the four sources disagreeing and what to fix on Yelp/BBB/Angi.
- **2026-07-28** Created. Added findings from the media hunt: AI photo replaced, phone/hours
  conflicts, duplicate listings, expired blog offers.
