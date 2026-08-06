# Email to Lloyd — ✅ REWRITTEN AND SENT 2026-08-01 · 🆕 follow up drafted 2026-08-04

**Sent.** Derrick rewrote it in his own voice and sent it the day the site went live. **Reply
expected Monday or Tuesday, 3 or 4 August.** Kept below as the record of what was asked, so the
reply can be checked against it.

**What to watch for in his reply, in priority order:**
1. **The GA4 measurement ID.** Until it is in the container, live traffic is going unrecorded and
   cannot be backfilled. This is the one with a running cost.
2. **Enhanced Measurement, "page changes based on browser history events."** Without it pageviews
   never fire on this site at all, because navigation is client side.
3. **Microsoft Clarity.** If he says it should stay on, the masking needs checking so it cannot
   record what someone types into the lead form.
4. **The Sheets request.** He was told no and offered a query against D1 instead. Expect him to come
   back with columns and a frequency.

---

## 🆕 FOLLOW UP TO SEND, 4 AUGUST. Booking came off the site.

Trinity asked for Housecall Pro's online booking to be switched off, so it is off, and **two lines in
the sent email below are now out of date.** He should hear it from us rather than find it.

- Item 5 says *"schedule-a-repair is now /book-a-repair/"*. **It is now `/get-service/repair/`**, and
  it is a single 301 rather than a chain.
- The events paragraph says `generate_lead` carries `contact-form` or `estimate-form`. **There are
  now 10 values.** Full table in `GTM-NOTES.md`.

⚠️ **Lead with the reassurance, because it is the true part and it is the part he cares about:
nothing of his breaks.** `/get-service/` and `/get-service/?intent=estimate` did **not** move, on
purpose, precisely because his Google Ads final URLs point at them. They are also in the verified 301
map and the sitemap. The 8 new form pages were added underneath that URL, never in place of it.

⚠️ **Do not tell him `book_online_click` is gone.** It is not fired today but it is still in our code,
and the switch back is one constant. Telling him to delete the tag creates work twice.

Paste the block below into a reply on the same thread.

---

Subject: Re: Trinity is live, five things need you

Lloyd,

One change on our side, and it touches two things I told you on the 1st.

Trinity asked for the Housecall Pro booking window to come off the site, so it's off as of today.
Every button that used to open it now goes to a request form instead. It's switched off rather than
ripped out, because they've said they'll likely want it back at some point.

Shortest version first: nothing of yours breaks. /get-service/ and /get-service/?intent=estimate
haven't moved and won't. Your final URLs point at them, so I left them exactly where they were.

Two corrections to that email. schedule-a-repair now lands on /get-service/repair/ rather than
/book-a-repair/, and it's one redirect, not a chain. And generate_lead now carries a lead_source that
names the form, so instead of two values there are ten: contact-form and estimate-form as before,
plus repair-form, spring-repair-form, opener-repair-form, off-track-form, cables-and-rollers-form,
tune-up-form, replacement-form and emergency-form. Same event, same trigger, it just tells you more.

There are also eight new landing pages you can point campaigns straight at, one per job:

/get-service/repair/
/get-service/spring-repair/
/get-service/opener-repair/
/get-service/off-track/
/get-service/cables-and-rollers/
/get-service/tune-up/
/get-service/replacement/
/get-service/emergency/

Each is the same form under a headline that matches the ad, and each reports its own lead_source. So
the Landing Page report will separate a spring click from an opener click, which it couldn't do when
everything funnelled through one URL. Point a spring ad at the spring one and it should read better
on relevance too.

Last thing. book_online_click doesn't fire any more, because there's no modal left to click. Leave
the tag where it is. The event is still in our code and it starts firing again the day booking comes
back, and an idle trigger costs you nothing. I'd rather it sat there reading zero than have you
delete it and rebuild it in a month.

Derrick

---

## The email that was sent on 1 August, kept as the record

⚠️ **Do not quote from below without checking it.** Item 5's `/book-a-repair/` line and the
`generate_lead` / `book_online_click` paragraph were overtaken on 2026-08-04, see the follow up
above. The text is unedited on purpose, so the reply can still be checked against what was asked.

Two notes for you first:

1. The **phone_click** event exists in our code as a type but is **deliberately not wired to
   anything**, so it never fires. The email tells him to use his own GTM click trigger instead. Do
   not let this get "helpfully" corrected into telling him we send a phone event, or he will build a
   trigger that reads zero on the conversion that matters most to this business.
2. The voice skill's advice applies: the **Clarity paragraph** and the **last paragraph about his
   Sheets request** are the two worth rewriting in your own words, since they carry the relationship.

---

Subject: Trinity is live, five things need you

Lloyd,

The new site went live today at trinitygaragedoorservice.com, apex and www both.

Your container GTM-MXNSKF57 is installed and firing. I checked it in a real browser rather than
assuming the install took: dataLayer initialises, gtm.js fires, and the container stamps
gtm.uniqueEventId onto our events, so it's genuinely consuming them.

One thing before the list. I didn't paste your snippet into the head. Next.js has an official
component for GTM and I used that instead, after reading its source to be sure it emits the same
dataLayer init, the same gtm.start timestamp and the same gtm.js event. Your tags and triggers
behave exactly as they would with your paste. The difference is that it loads after hydration
rather than blocking the page, which is what keeps the speed you liked. I added the noscript iframe
by hand, because that component leaves it out.

Five things on your side.

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

5. Point your ad final URLs at the new addresses. Every old URL redirects, and I tested that the
redirects keep gclid and your utm parameters intact, including the one that adds a parameter of its
own, so nothing is broken today and attribution is safe. But a redirect on a paid click costs you a
hop, and the Ads landing page report will keep reporting the old URL. The three that probably matter
to you: request-an-estimate is now /get-service/, schedule-a-repair is now /book-a-repair/, and the
service pages moved from slugs like /services/garage-door-spring-repair-and-replacement/ to
/services/repair/spring/. Ask me for the full old to new list and I'll send it.

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
