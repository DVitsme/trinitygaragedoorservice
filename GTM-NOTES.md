# Google Tag Manager, how it is wired and what to tell Lloyd

**Installed 2026-07-29.** Container **GTM-MXNSKF57**, supplied by Lloyd Herrera (Annek).

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
| `generate_lead` | `lead_source`: `contact-form` or `estimate-form` | The contact or estimate form succeeds. **Fires after the API confirms the lead was captured**, not on button click, so the count matches reality |
| `phone_click` | `link_location` | *(not yet wired, see below)* |
| `book_online_click` | `link_location` | Any "Book Online" button, all 13 of them |
| `zip_check` | `zip_result`: `in_area` or `out_of_area`, plus `zip` | Someone uses the service area checker. **`out_of_area` is the useful one**: it measures demand from outside the service area, which tells you where to expand or where to stop paying for clicks |

Build **Custom Event** triggers on these names.

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
