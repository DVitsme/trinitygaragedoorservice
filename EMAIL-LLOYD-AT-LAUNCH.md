# Email to Lloyd, to send AFTER the site is live

**Do not send before cutover.** Two of the four asks only make sense once real traffic is arriving,
and the Clarity question is easier for him to check against live data.

Copy the text below the line into Gmail. Nothing here has been sent.

Two notes for you first:

1. The **phone_click** event exists in our code as a type but is **deliberately not wired to
   anything**, so it never fires. The email tells him to use his own GTM click trigger instead. Do
   not let this get "helpfully" corrected into telling him we send a phone event, or he will build a
   trigger that reads zero on the conversion that matters most to this business.
2. The voice skill's advice applies: the **Clarity paragraph** and the **last paragraph about his
   Sheets request** are the two worth rewriting in your own words, since they carry the relationship.

---

Subject: GTM is live, four things need you

Lloyd,

Your container GTM-MXNSKF57 is installed and firing. I checked it in a real browser rather than
assuming the install took: dataLayer initialises, gtm.js fires, and the container stamps
gtm.uniqueEventId onto our events, so it's genuinely consuming them.

One thing before the list. I didn't paste your snippet into the head. Next.js has an official
component for GTM and I used that instead, after reading its source to be sure it emits the same
dataLayer init, the same gtm.start timestamp and the same gtm.js event. Your tags and triggers
behave exactly as they would with your paste. The difference is that it loads after hydration
rather than blocking the page, which is what keeps the speed you liked. I added the noscript iframe
by hand, because that component leaves it out.

Four things on your side.

1. Turn on Enhanced Measurement in GA4, specifically "Page changes based on browser history
events". The site does client side navigation, so moving between pages never fires a normal page
load, and that setting is what makes pageviews work. I deliberately don't push our own page_view,
because doing both would double count every navigation.

2. GA4 isn't in the container yet. I pulled the container down and it carries your Ads ID
AW-995017484, Google call tracking, DoubleClick and the Bing UET tag, but no GA4 measurement ID. So
if the reports look empty later, that's why, and it isn't the install.

3. Use your own click trigger for phone calls, not an event from us. Every tel link on the site is
a plain anchor built from one constant, so a Just Links trigger on Click URL contains tel catches
all of them. We do not push a phone event, and I'd rather tell you that plainly than have you build
a trigger on something that never fires. Phone calls are how this business actually converts, so
undercounting there would be the expensive mistake.

4. Microsoft Clarity is running, and I don't think anyone picked it. It isn't in the container
itself. It gets pulled in by the Bing UET tag, because Microsoft Advertising turns Clarity on
alongside it. So session recording is live on the site as a side effect of an ads tag. I could be
wrong about the mechanism, but the requests are definitely there. If it's meant to be on, it's
worth checking the masking so it can't capture what somebody types into the contact form. If it
isn't, it switches off in Microsoft Advertising without touching the site.

Three events are wired for you to build custom event triggers on. generate_lead carries a
lead_source of either contact-form or estimate-form, and it fires only after the server confirms
the lead was actually captured, not on the button click, so the count matches reality.
book_online_click carries link_location. zip_check carries a zip_result of in_area or out_of_area
plus the zip itself, and that last one is the one I'd look at first, because it measures how much
demand is arriving from outside the area they actually serve.

No conversion value is sent, on purpose. Their median job is about $855, but that number belongs in
your Ads interface where you can change it, not buried in a website.

Last thing, on the Sheets copy you asked for. I'd rather not add a third write to the lead path,
because every extra place a submission has to land is another thing that can fail while somebody is
filling in the form. The leads are already in a database I can query directly. Tell me the columns
you want and how often you want them, and I'll get them to you a way that can't break the form.

Derrick
