# Google Tag Manager, how it is wired and what to tell Lloyd

**Installed 2026-07-29.** Container **GTM-MXNSKF57**, supplied by Lloyd Herrera (Annek).

---

## 🔴 Three things in the container are broken right now. Read this first.

Found 2026-08-04 by pulling the live container (455 KB) and Google's call tracking bundle (53 KB)
and reading them, rather than by asking. **All three are fixes on Lloyd's side, in the GTM UI, with
no deploy.** They are ordered by how much they cost.

### 1. The form conversion has never fired. Not once.

**Tag 18** is a Google Ads conversion (`conversionId 17056268955`, label `mLRkCKyhqagbEJuFiMU_`)
fired by an **Element Visibility trigger on `.elementor-message-success`**.

That is an Elementor success message. Elementor is a WordPress page builder. **This site has never
been WordPress**, and the string `elementor` appears nowhere in the source or the built HTML. So the
conversion action that is presumably being used to judge whether this website works has been
reading **zero since install**, and will keep reading zero forever.

**Fix:** repoint that tag's trigger at a **Custom Event** trigger with event name `generate_lead`.
That event already fires, on all 10 forms, only after the server confirms the lead was captured.
Five minutes, no deploy, and it turns the primary conversion from "never fires" into "fires
accurately".

### 2. Two Google Ads accounts are live in one container, and one is half wired

- **`AW-995017484`** has a Google tag (`__googtag`, listed **twice**, a duplicate), the four call
  tracking tags, and remarketing.
- **`17056268955`** has the dead form conversion above plus a user data tag, and **no Google tag
  anywhere**. `AW-17056268955` appears zero times in the container.

**Running two accounts in one container is legitimate**, and if both are spending, both should have
their own conversion tracking. What is not optional is that **conversions have to be reported to the
account that bought the click.** Auto tagging issues a `gclid` tied to the campaign that served the
ad, and a conversion reported to account B cannot be matched against a click bought by account A. It
lands unattributed, bidding never sees it, and cost per lead cannot be computed in the account that
is actually paying.

So the question for Lloyd is **not** "which one is real". It is **"which account is buying the
clicks?"** If one, everything belongs there. If both, each needs conversion tracking for its own
campaigns. If they want it unified, that is cross account conversion tracking under a manager (MCC)
account.

**Measured in a real browser 2026-08-04:** despite having no Google tag, account `17056268955` still
receives traffic, 3 hits each to `viewthroughconversion/`, `rmkt/collect/`, `1p-user-list/` and the
`form-data` endpoints. GTM bootstraps it off the conversion and user data tags. Only
`GTM-MXNSKF57` and `AW-995017484` register in `window.google_tag_manager`.

Same question applies to Microsoft: there are **two Bing UET tag IDs**, `343191774` and `187230812`.

### 3. One call tracking tag is configured for a number that is not on the website

There are **four** `__awcc` (call tracking) tags, one per number, all on All Pages:

| Number configured | Where it actually appears |
|---|---|
| `(813) 447-3874` | `/contact/` only |
| `(813) 279-6785` | every page |
| `(727) 314-5062` | `/contact/` only |
| **`(813) 731-8405`** | **nowhere on the website.** ✅ **Source identified 2026-08-10, see below** |

The fourth can never match. It fails on all 32 pages, after already pulling a forwarding number
from the pool. **Delete it** from the website container.

#### ✅ Where (813) 731-8405 actually comes from

Found in the client's own Google Business Profile Takeout export, 2026-08-10. It is the **SMS deep
link on their Tampa listing**:

```
location-15806677045058781112  "Trinity Garage Door Service, LLC - Tampa"
  SCALABLE_DEEP_LINK   sms:+18137318405
```

So it was never a typo or a stale number. It is a **real Trinity channel that Google drives**, which
is exactly why it ended up in an Ads container. It still does not belong in a **website** call
tracking tag, because it appears on no page of the site and therefore can never be swapped. Deleting
the `__awcc` tag stands. **Tell Lloyd what it is** so he does not re-add it later wondering where it
went, and so any text message conversions get measured on the Google listing rather than here.

#### ⚠️ And a fourth number nobody had: (813) 397-6104

The same export shows the Tampa listing's **primary phone** is **(813) 397-6104**, which appears
**nowhere on the website and in no call tracking tag**. Trinity now has five numbers in play:

| Number | Where it lives |
|---|---|
| (813) 279-6785 | Every page of the site. Lutz Google listing. The one number the site uses |
| (813) 447-3874 | `/contact/` only. Hillsborough county line |
| (727) 314-5062 | `/contact/` only. **Oldsmar Google listing** |
| **(813) 397-6104** | **Tampa Google listing only. Not on the site, not tracked** |
| **(813) 731-8405** | **Tampa Google listing SMS link. Not on the site. Tag should be deleted** |

**This matters more than it looks on a business whose revenue arrives by phone.** Two of their five
numbers are reachable only through Google listings, so calls to them cannot be attributed by
anything we control, and they are invisible to the site's own measurement.

Note Google documents a limit of **one tracked number per page**. Three on `/contact/` works because
of how the module is built, not because it is supported. Confirm it in GTM Preview: set
`sessionStorage.setItem('_goog_wcc_debug','y')` and reload, and their debug window logs
`Updated N element(s)` or `Could not find …` per tag.

---

## What we did instead of the paste, and why it is safe

Lloyd sent the standard two part snippet (a `<script>` for `<head>`, a `<noscript>` for after
`<body>`). We installed the same container through Next's official `@next/third-parties` component
instead. **Nothing about his setup changes.**

Verified against the package source before shipping: it emits a byte equivalent `dataLayer` init,
the same `gtm.start` timestamp and the same `event: 'gtm.js'` push. The only difference is that it
loads `afterInteractive` rather than blocking head parse, which is what preserves the speed he
complimented on the call.

The `<noscript>` iframe is **not** included by that package, so we added it by hand in
`app/layout.tsx`. Google still ships it as standard.

Proven working on a real browser, not assumed:

```
dataLayerExists: true   hasGtmStart: true   hasGtmJsEvent: true
containerLoaded: true   containerIds: ["GTM-MXNSKF57"]
```

Set `NEXT_PUBLIC_GTM_DISABLE=1` to switch it off for local QA, so screenshot runs never fire
conversions into the live Ads account.

---

## ⚠️ What is actually in the container, measured

Fetched and loaded the real container. It is **not** just Google Analytics:

| Vendor | Loaded | Notes |
|---|---|---|
| **Google Ads** `AW-995017484` | 154 KB | conversion tracking, already live |
| **Google call tracking** | 24 KB | `gstatic.com/call-tracking` |
| **DoubleClick** | 8 KB | remarketing |
| **Microsoft Bing Ads UET** | 18 KB | `bat.bing.com` |
| **Microsoft Clarity** | 27 KB | ⚠️ **session recording**, see below |
| **GA4** | **not present** | Lloyd is still creating the property |

### 🔴 Microsoft Clarity is recording sessions, and it arrived indirectly

Clarity does **not** appear in the container's own source. It is loaded **by the Bing UET tag**,
because Microsoft Advertising auto enables Clarity alongside UET. So session recording is running
on this site as a **side effect of an ads tag**, not as a tag anyone deliberately added.

That matters because Clarity records mouse movement, clicks and scrolling, which is a materially
bigger privacy disclosure than page view analytics. **It is now named explicitly in the privacy
policy**, along with Microsoft.

**Worth asking Lloyd and Simone:** is Clarity intended? If yes, confirm the masking level so it can
never capture what someone types into the contact form. If not, it can be switched off in
Microsoft Advertising without touching the site.

---

## What this cost, measured before and after

| | Before | After |
|---|---|---|
| Third party bytes | **5,187** | **398,014** |
| JavaScript | 246 KB | 635 KB |
| Requests | 147 | 176 |

The site had exactly one third party dependency before this (the 5 KB Housecall Pro booking
script). This is a real, accepted cost for attribution, but it is worth Lloyd knowing the number,
especially since **GA4 is not even in the container yet** and will add roughly another 150 KB.

Browsers have partitioned the HTTP cache per site since 2020, so there is no shared CDN saving.

---

## The events we push, for building triggers

Our code pushes **named business events only**. Lloyd owns every tag and every generic pageview, so
he can add, rename and retire tags in the GTM UI forever without a deploy.

| Event name | Parameters | Fires when |
|---|---|---|
| `generate_lead` | `lead_source`, one of **10** values, listed below · `transaction_id` | Any lead form on the site succeeds. **Fires after the API confirms the lead was captured**, not on button click, so the count matches reality |
| `phone_click` | `link_location` | *(not yet wired, see below)* |
| `book_online_click` | `link_location` | ⚠️ **Nothing fires this today.** See below, and **leave the tag in place** |
| `zip_check` | `zip_result`: `in_area` or `out_of_area`, plus `zip` | Someone uses the service area checker. **`out_of_area` is the useful one**: it measures demand from outside the service area, which tells you where to expand or where to stop paying for clicks |

Build **Custom Event** triggers on these names.

### `lead_source` now says WHICH form, and there are 10 of them

Updated **2026-08-04**. Online booking was switched off at the client's request and every booking
button now goes to a request form of its own, so a conversion finally carries the page it came from.
The two originals are unchanged **on purpose**, because they are already in the client's lead data
and in Lloyd's container, and renaming them would split his reporting in half.

| `lead_source` | Where it comes from |
|---|---|
| `contact-form` | `/get-service/` and the contact page form *(unchanged)* |
| `estimate-form` | `/get-service/?intent=estimate` *(unchanged)* |
| `repair-form` | `/get-service/repair/` |
| `spring-repair-form` | `/get-service/spring-repair/` |
| `opener-repair-form` | `/get-service/opener-repair/` |
| `off-track-form` | `/get-service/off-track/` |
| `cables-and-rollers-form` | `/get-service/cables-and-rollers/` |
| `tune-up-form` | `/get-service/tune-up/` |
| `replacement-form` | `/get-service/replacement/` |
| `emergency-form` | `/get-service/emergency/` |

The same value is written to the lead's `source` column in D1 and printed on the office's lead email
as "Came from", so the number in GA4 and the number Barbara sees are the same fact.

`lead_source` is **not a name we invented**. It is Google's own documented parameter on the
`generate_lead` recommended event, defined as "the source of the lead", and it is not on GA4's
reserved list, so nothing has to be renamed when GA4 finally lands.

### `transaction_id`, added 2026-08-04

Every `generate_lead` now also carries a `transaction_id`. **Map it to the Google Ads conversion
tag's Transaction ID / Order ID field.** Google dedupes two conversions on the same action that
share one, which is a *different* mechanism from the Count setting, and Google says to use both.

The value is an opaque hash of phone, name and message. That is deliberate on two counts. It is not
the database row id, because returning that would tell anyone who submits the form roughly how many
leads this business has ever taken. And the semantics are already right: a double submit of the same
enquiry produces the **same** reference so Google collapses it, while a genuinely new enquiry
produces a new one. It is the same key Resend already uses to stop the office getting two copies.

---

## 🟠 Enhanced Conversions is already armed in the container, and it is one trigger from live

**Nobody on our side set this up.** Tag 12 is a Google Ads **User-Provided Data** tag (`__awud`)
pointed at `17056268955`, firing on **every page**, fed by this variable:

```
__awec   mode: AUTO   isAutoCollectPiiEnabledFlag: true   enableElementBlocking: false
```

That is automatic PII collection, with no elements excluded. It matters because the privacy policy
states, of Google: *"It does not receive what you type into our forms."*

### Measured in a real browser, 2026-08-04. That sentence is currently TRUE.

Drove headless Chrome over the DevTools Protocol against the production build with GTM live, filled
in first name, phone, email and zip with probe values, clicked submit, and captured all 70 outbound
ad and analytics requests. `/api/contact` was blocked so no lead was created.

- Searched every URL and body for the probe email and phone as **plaintext, SHA-256 hex, base64 and
  base64url**. **Zero hits.**
- The 10 POSTs to Google's `pagead/form-data/` and `ccm/form-data/` endpoints, for both accounts,
  **all had empty bodies.**

It collects nothing today because it fires at page load, when the form is still empty.

### ⚠️ But it is latent, not safe

**If anyone repoints that `__awud` tag at a form submit event, it starts collecting immediately**,
and that is exactly the change someone would make to "turn enhanced conversions on". At that moment
the privacy policy sentence becomes false, and the exposure is FTC Act §5 and Florida's FDUTPA,
neither of which has a revenue floor.

**Recommendation: switch the variable from AUTO to Manual, or turn the tag off.** We deliberately
chose not to send hashed customer data to Google, partly because anything in that dataLayer is also
readable by the Bing UET and Clarity tags in the same container. Broadening the policy instead would
concede a data flow nobody actually chose.

**Not tested:** the successful submission path, because blocking `/api/contact` was the only way to
avoid creating a real lead. On a real success the fields are wiped and the page navigates, so there
is less for AUTO mode to find, not more.

## ✅ Microsoft Clarity's input masking is real, and it was verified rather than assumed

The policy also claims Clarity *"is set to hide what you type into form fields"*. Clarity gzips its
payloads, so a plaintext check of the wire proves nothing. Hooked `fetch`, `XMLHttpRequest.send` and
`navigator.sendBeacon` inside the page before Clarity loaded, kept the raw bytes, and decompressed
them.

**Instrument validated first:** gzip decode worked (9,683 bytes in, 26,939 characters out) and two
positive controls, the page slug and the `Request My Callback` button label, were found inside the
decompressed payload. So the payload was genuinely readable.

**Inside that same readable payload: no first name, no phone, no email, no zip, and none of the free
text message.** The masking claim holds, including for the message box, which is the field most
likely to contain something sensitive.

---

## How to see WHICH form a conversion came from

There are two independent ways, and they answer different questions. Set up both, they cost nothing.

### 1. Custom variables for conversions — gives per form conversion counts

1. Send `lead_source` as a parameter on the Google Ads conversion tag.
2. **Goals → Conversions → Custom variable →** find `lead_source` at "Activation needed" → **Activate**.
   Nothing records until this is done.
3. Read it at **Campaigns → Segment → Conversions → Custom variables**.

Data appears within a few hours. Variable names must be lowercase, values are capped at 100
characters, and **no PII may ever go in one**.

⚠️ **Its limitation, so nobody is surprised:** conversion based segments only populate conversion
columns. Clicks, Impr. and Cost render as `--`. **You cannot get cost per lead by form from this
segment.** That is why the second method matters.

⚠️ **One thing to check in the UI before relying on this.** Google documents custom variables with
gtag.js syntax only. Whether the GTM **Google Ads Conversion Tracking** tag template exposes a
generic parameter field is not documented anywhere Google authored, and GTM's release notes through
July 2026 never mention it. A credible practitioner source says there is an "Event Parameters"
section on the tag. **Open the tag and look.** If it is not there, the fallback is a Custom HTML tag
firing `gtag('event','conversion',{send_to:'AW-…/LABEL', lead_source:{{DLV - lead_source}}})` on the
same trigger, with the native tag disabled for that trigger so it does not double count.

### 2. The Ads webpages report — free, already working, needs nothing

Google reports a conversion's URL from `location.pathname` **at the moment the tag fires**. The tag
fires on the **form page**, so the per conversion action webpages report **already** separates
`/get-service/spring-repair/` from `/get-service/opener-repair/` with no configuration at all.

**This is why there are eight request form pages and only ONE thank you page.** Per form thank you
URLs would add nothing, because the conversion URL is the form page either way.

### ⚠️ Why query parameters were considered and rejected

The obvious idea is `/thank-you/?form=spring-repair`. It does not work, and Google documents exactly
why: "if your conversion URL is `example.com/conversion-page?id=123` … the `id=123` part **is not
reported**. All conversions that are associated with different IDs are reported collectively under
one URL." GA4's default page dimension strips the query string too. A conversion triggered on a URL
also **cannot carry custom parameters at all**, so going that route would lose the segmentation the
parameters were meant to provide. Do not revisit this.

---

## The thank you page: `/thank-you/`

Added 2026-08-04. Every form now lands here after a successful submission.

**⚠️ There is deliberately NO tracking on it, and none may ever be added.** The conversion fires one
navigation earlier, on the form page, the moment the API confirms capture. That is what makes the
page safe:

| | |
|---|---|
| refresh it | nothing fires |
| press Back onto it | nothing fires |
| bookmark or share it | nothing fires |
| Googlebot crawls it | nothing fires |

A tag bound to this URL would fire on every one of those. GTM's History Change trigger also fires on
`popstate`, so Back alone would double count, and the App Router keeps only one bfcache entry so Back
re-mounts the component and re-runs any effect. If anyone asks for "a pixel on the thank you page",
the answer is that it already fired, more accurately, a moment before.

It is `noindex, nofollow` and deliberately absent from the sitemap.

**Also set, on the Ads side:** Count = **"One"**, explicitly. The documented default for *website*
conversion actions is "Every"; the widely repeated "lead category defaults to One" is not in current
Google documentation. On Microsoft, `CountType = Unique` (it defaults to `All`).

---

## Ad click capture, shipped 2026-08-04

`middleware.ts` now captures **`gclid`, `gbraid`, `wbraid` and `msclkid`** plus the landing page from
the ad's final URL, and stores them against the lead in D1 (migration `0004_lead_attribution.sql`).

Before this, **nothing anywhere captured a click identifier**, so every paid click that produced a
lead was permanently unattributable. That is the one thing here that cannot be backfilled.

Two implementation details worth knowing, because both are silent failures if done the obvious way:

- **It is server side, via an HTTP `Set-Cookie`, not JavaScript.** WebKit's ITP caps *JavaScript
  written* cookies to **24 hours** when the landing URL carries a query string and the referrer is a
  classified domain, which is the exact definition of an ad click. Google's own `_gcl_aw` inherits
  that cap because gtag writes it with `document.cookie`. A cookie set by an HTTP response header
  from the real first party origin gets the full 90 days.
- **It is middleware, not the form component.** This site navigates client side, so a visitor who
  lands on `/services/repair/spring/?gclid=…` and then clicks a CTA has no query string left by the
  time they reach a form. Reading it at the form would capture close to nothing while looking fine.

Verified on the real Workers runtime, not `next start`: the cookie is set on a click, and a second
visitor hitting the same cached page gets **no** `Set-Cookie`, so nothing leaks between visitors.

**What this unlocks, when it is wanted:** the D1 `leads` table can now be joined from ad click →
lead → `hcp_lead_id` → completed Housecall Pro job → real invoice value.

---

## What we deliberately did NOT build, and when to revisit

**Offline conversion import / Enhanced Conversions for Leads.** The reporting half, where closed
jobs are uploaded back to Google with their real value, is not built. Three reasons:

1. **Volume.** Google's own evaluation guidance is 30 conversions in 30 days, and value based
   bidding (tROAS) needs 15. Trinity's website produced **12 jobs all time**. Uploading three booked
   jobs a month would be a precision instrument delivering a signal below the learning threshold.
2. **The easy route closed.** Since **15 June 2026** Google blocks new adopters from uploading
   offline conversions through the Google Ads API. Trinity has no developer token, so that path is
   shut; it would have to be the newer Data Manager API. **If anyone proposes an Ads API integration
   for this, it will fail on the first request.** Worth asking Annek whether they hold an
   allowlisted token from before that date, because that would change the maths in their favour.
3. **Enhanced Conversions for Leads needs a privacy policy change first.** It works by sending a
   hashed email or phone to Google. `app/privacy-policy/page.tsx` currently states, of Google, "It
   does not receive what you type into our forms." That sentence would become false. The exposure is
   FTC Act §5 and Florida's FDUTPA, neither of which has a revenue floor. Also note that anything
   pushed to the dataLayer is readable by **every** tag in this container, including Bing UET and
   Clarity, so customer email would leak to Microsoft as a side effect.

**Revisit when** either GA4 is live and the account shows real website lead volume, or the client
asks for revenue based bidding. Build it then as a scheduled Worker against the Data Manager API,
not as a human exporting a spreadsheet, which will lapse within about six weeks.

**Two things to do now anyway, because they are free and time sensitive:**

- **Create the offline conversion action now, even though nothing will upload to it yet.** Google
  will not import a conversion for a click that predates the conversion action's existence. Creating
  it costs nothing and preserves the option; not creating it throws away every click until someone
  does.
- **Set its click through conversion window to 90 days, not the default 30.** It has to be right
  *before the clicks happen*, not before the upload. Trinity's cycle is call back, then book days
  later, then a homeowner who thinks about it, which will regularly exceed 30 days.

---

## Calls are where the money is, and they are the biggest gap

Measured from the client's own CRM, **July 2026: 93 paid invoices, $149,800, lead source tagged on
every one.**

| Source | Jobs | Paid |
|---|---|---|
| Repeat | 43 | $80,264 |
| Google Maps | 14 | $15,431 |
| Google | 6 | $23,051 |
| **Google Ads** | **6** | **$5,674** |
| Angi Leads | 4 | $5,259 |
| 9 other sources | 20 | $20,119 |

Form fills are a small slice of a business whose revenue arrives by phone. Which makes the two call
defects below worth more than any form tracking refinement.

### What we fixed on the site

**The sticky mobile bar rendered the bare word "Call"** with no number. Google's number insertion
walks text nodes for the configured number, rewrites the visible text, and only **then** climbs to
the enclosing anchor to rewrite its `href`. No matching text means it never climbs, so that anchor
kept the real number and **every call placed from it was invisible to Google Ads**. On a phone led
business, that is the persistent call button on every mobile page. The number is now in the anchor as
`sr-only` text, which the tag walker treats identically and which also gives a vague link a real
accessible name.

### What is still broken, and needs Lloyd

**Number insertion does not survive client side navigation.** The bundle has no MutationObserver and
no history hook, the call tags fire on `gtm.js` only, and the container has **no History Change
trigger and no click listener at all**. Since the header and footer are not remounted on an internal
link click but `<main>` is, after one navigation the visitor sees **the forwarding number in the
header and the real number in the body**. Adding a History Change trigger alongside All Pages would
re-run the swap, but re-firing the config requests another forwarding number, so **test it in Preview
and watch the pool** before trusting it.

### Pick exactly ONE source of truth for call conversions

If both a `tel:` click trigger and Google's website call conversion are set to Primary, one person
making one call produces two conversions. Google does not dedupe across conversion actions.

**The rule:** exactly one call action may be **Primary**. Everything else call related is
**Secondary**, so it still reports but never enters the Conversions column and never feeds bidding.

Recommended: **"Calls to a number on your website"** as the only Primary, because it measures an
answered call of at least N seconds rather than a tap, and forwarding numbers are free. Build the
`tel:` click conversion too (Just Links, Click URL contains `tel:`, **Wait for Tags off**) but leave
it **Secondary** as a diagnostic. `phone_click` exists in our `TrackEvent` union with nothing wired
to it if a first party event is ever preferred over GTM's click listener.

**On paying ~$30/month for CRM call tracking numbers: hold off.** Google's forwarding numbers are
free and cover the paid ads question. A purchased number answers a different one, which is whether
Maps, organic or the truck decal produced a call, and the office is already answering that for free
by filling in the lead source field. July's data was 100% tagged. Ask them to keep doing exactly
that before anyone buys a number.

### One free thing that saves money today

Add the **"All converters"** audience as a campaign exclusion. It populates automatically from the
conversion tag, needs no URL and no GA4, and stops paying to re-advertise to people who already
converted. Per form exclusion audiences would need distinct thank you URLs and would not reach
Google's 100 user serving floor at this volume anyway, so this is the version that actually matters.

### ⚠️ `book_online_click` does not fire any more, and that is fine

It fired on the Housecall Pro booking modal, which produced **no navigation to measure**, so a click
was the only observable thing. Booking is off (`BOOKING_MODE` in `lib/booking.ts`) and those buttons
are now ordinary links to the request form pages, so the form page's own `page_view` is the signal,
and it is a better one: Google Ads' Landing Page report and GA4 both key on URL, and a dataLayer push
racing a navigation is a known way to lose events.

**Leave the existing tag and trigger in the container.** The event is still a valid member of our
`TrackEvent` union, an idle trigger costs nothing, and the client expects to want booking back, at
which point it starts firing again with no work on Lloyd's side.

### Two things Lloyd needs to do on his side

1. **Turn on GA4 Enhanced Measurement, "Page changes based on browser history events."** This site
   is a single page app for navigation, so a normal page load does not happen when someone moves
   between pages. That setting is what makes pageviews work. **We deliberately do not push our own
   `page_view`**, because doing both would double count every navigation.
2. **Pick ONE source for phone call conversions.** Every `tel:` link on the site is a plain
   `<a href="tel:...">` built from one constant, so his GTM Click trigger (Just Links, Click URL
   contains `tel:`) will catch all of them natively. If we later also push `phone_click`, wiring the
   Ads conversion to both would double count calls, and calls are how this business actually
   converts.

### No conversion value is sent, on purpose

Their median job is about $855, but hardcoding a revenue figure in the website would silently drive
Smart Bidding from a number buried in the codebase. **Conversion value belongs in the Ads/GA4 UI**,
where the person accountable for it can change it. We emit the fact that a lead happened.

---

## Consent, settled

**No cookie banner is required**, checked against the actual statutes rather than assumed. The
Florida Digital Bill of Rights applies only above **$1 billion** revenue. CCPA needs $25M or
100,000 consumers. GDPR is a **targeting** test, and a Florida only business with a Lutz address and
an 813 number does not target the EU merely by being reachable. Consent Mode v2 is scoped by Google
to EEA traffic.

**But the privacy policy had to change the same day, and it has.** The old text promised *"if we add
website analytics or advertising tools in the future, we will update this policy to describe
them."* Shipping tracking while that promise sat unfulfilled would be a deceptive practice under
FTC Act §5 and Florida's FDUTPA, **neither of which has a revenue floor**. The policy now names
Google and Microsoft, lists the cookies and their lifetimes, and links Google's opt out add on.
