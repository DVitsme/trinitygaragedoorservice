# Email to Lloyd, conversion tracking. DRAFTED 2026-08-04, NOT SENT.

Derrick sends this himself. Paste the block below the line into Gmail.

Companion doc: **`GTM-NOTES.md`** carries the full detail and the reasoning. This email is the
short version with the asks in it. `EMAIL-LLOYD-AT-LAUNCH.md` is the earlier thread.

**Before sending, two things to decide:**

1. **The Elementor finding is the headline and it is slightly awkward**, because that tag is his
   work and it has never fired. It is written straight, with no blame and no softening, which is the
   right call. But read it once as him.
2. **The GTM "Event Parameters" question is genuinely open.** We could not confirm from anything
   Google authored that the GTM Google Ads conversion tag template exposes a custom parameter field.
   The email asks him to look rather than asserting it exists. Do not let anyone "tidy" that into a
   confident instruction, because if the field is not there he will waste an hour hunting for it.

**What to expect back:** the account ID answer is the one that unblocks everything else. Until we
know whether `995017484` or `17056268955` is live, the form conversion cannot be rebuilt in the
right place.

---

Subject: your form conversion has never fired, and four other things

Lloyd,

I pulled your container down and read it rather than assuming, same as I did with the install at
launch. Five things came out, and the first is why I'm writing today instead of Friday.

Tag 18, the Google Ads conversion on the form, fires on an Element Visibility trigger looking for
.elementor-message-success. That's a WordPress Elementor class. This site has never been WordPress,
and that string appears nowhere in the source or in the built HTML. So that conversion has been
reading zero since install and would have carried on reading zero. Repoint the trigger at a Custom
Event on generate_lead and it starts working. That event already fires on all ten forms, and only
after the server confirms the lead was saved, so the count matches what's actually in the database.

While I was in there I found two different Google Ads IDs. The four call tracking tags and
remarketing sit on AW-995017484, and that dead form conversion sits on 17056268955. I don't know
which is the live account, so tell me and I'll stop guessing.

One more thing in the container. There's a fourth call tracking tag set up for (813) 731-8405.
That's the number on their storefront decal and it isn't anywhere on the website, so it can never
match. It fails on all 32 pages, and it pulls a forwarding number from the pool each time before it
fails. I'd delete it.

Now our side.

The sticky call button at the bottom of every mobile page used to say just "Call", with the number
only in the link. Google's call tracking finds the number in the visible text first and rewrites the
link second, so with no number in the text it never touched that button, and every call from it was
invisible to you. The number is in there now. That one bothered me more than the rest, because it's
a phone business and that's the most tapped call button on the site.

generate_lead now carries a transaction_id alongside lead_source. Map it to the Transaction ID field
on the conversion tag. It stops a double submit counting twice, which the Count setting on its own
won't do. Set Count to One as well, since the documented default for website actions is Every.

To see which form a conversion came from, use custom variables. Send lead_source as a parameter on
the conversion tag, then activate it under Goals, Conversions, Custom variable, and it becomes a
segment. Here's the part I couldn't nail down. Google only documents that with gtag syntax, and I
found nothing Google wrote about whether the GTM conversion tag template has a field for it. Open
the tag and look for an Event Parameters section. If it isn't there, say so and I'll send you a
Custom HTML version instead.

You get it a second way for free, though. Google reports the conversion URL from location.pathname
at the moment the tag fires, and the tag fires on the form page, so the webpages report already
separates a spring lead from an opener lead with no setup at all.

Forms now land on a thank you page at https://trinitygaragedoorservice.com/thank-you/ and there is
deliberately no tag on it. The conversion fires one navigation earlier, on the form page, which
means a refresh, a back button, a bookmark or Googlebot can't inflate your numbers. If it looks
wrong to you that there's no pixel on the confirmation page, that's the reason.

Last one, and it has a clock on it. We now capture gclid, wbraid and msclkid on the landing page and
store them with the lead, which nothing was doing before. Two asks that go with that. Create the
offline conversion action now, even though nothing will upload to it yet, because Google won't
import a conversion for a click that happened before the action existed. And set its click through
window to 90 days rather than the default 30, because these jobs get booked on a callback days later
and 30 will lose you real ones without ever showing an error.

Free win while you're in there. Add All converters as a campaign exclusion. It fills itself from the
conversion tag and needs no URL.

Which account is live, 995017484 or 17056268955?

Derrick
