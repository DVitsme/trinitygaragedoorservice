# Knowledge brief for claude.ai/design — redesign "Book a Repair" around the Housecall Pro embed

> This is a **knowledge brief**, not a layout spec. It tells you how the booking integration
> works so you can design the best-fit page. **You own every design and layout decision.**
> Paste this into claude.ai/design as the prompt.

---

You're redesigning Trinity's **Book a Repair** page (Bold Trade system, the same brand you've
been designing). I'm your knowledge base for how the booking works. I won't tell you how to lay
it out — that's your call. Design the best page for the reality below.

## The mechanism (decided): the Housecall Pro embed

The real booking interface — choosing a service, picking a date and arrival window, entering the
address and contact details, an optional deposit, and the confirmation — is **built, hosted, and
owned by Housecall Pro (HCP)**. We add it to this page with HCP's **embed: a "Book Online" button
that opens HCP's booking flow in a modal popup on top of this page.** The customer never leaves
trinitygaragedoorservice.com, and HCP runs all the booking logic and real-time availability.

So this page is **not** the booking form, and it must **not** contain a calendar or a date/time
picker. (The current placeholder fakes a calendar — remove it; the real one lives inside the HCP
modal.) The page's whole role is to **frame, reassure, and launch** that modal.

We are deliberately **not** building our own in-page booking form, calendar, or step wizard — the
embed is the entire booking experience, so don't design one.

## About the trigger (a real constraint)

The modal opens from **HCP's embedded button**. We may not be able to perfectly restyle that
button to match Bold Trade, so **give it a strong, obvious home and let the surrounding page
carry the brand and the persuasion.** Treat the button as a fixed object you're framing, not a
component you fully control.

## What the HCP modal already handles (so you never duplicate it)

Pick a service (services have names, descriptions, images) · optional service-area check by ZIP ·
timing shown as **arrival windows** ("10am to 12pm", not an exact minute) or fixed start times or
"just leave your details and we'll call you", with real-time availability · address · contact
(name, phone, email) · optional card deposit to hold the slot · automatic confirmation to the
customer and to Trinity, with the job dropped on the team's schedule. Customers **cannot cancel
online** — to change or cancel they call us.

## What this page needs to accomplish (design these however works best)

- Give a visitor the confidence to tap **Book Online** (who we are: 24/7, same day, licensed,
  honest, local).
- Briefly set expectations for what happens after they tap it (they pick a service and an arrival
  window, give their address and details, maybe a deposit; we confirm), and the "to change or
  cancel, just call us" caveat.
- Keep the **alternatives obvious** for people who don't want to self-book: call
  (813) 279-6785 (24/7), or request a free estimate / send a message (our existing form).
- Make HCP's **Book Online button the clear, prominent action** on the page.

## Facts & constraints (use as needed; don't let them dictate layout)

- Custom Next.js site. The booking button and modal come from HCP (an embed script); we can't
  restyle the inside of HCP's modal, so the on-page experience should hand off to it cleanly and
  feel intentional, not jarring.
- Brand: Bold Trade (near-black `#1A1A1A`, accent red `#b8202a`, cream, Archivo Expanded +
  Hanken Grotesk). Voice: plain, warm, **dash-free**, no AI tells, never invent prices/guarantees.
- Trinity: family owned, Tampa Bay (Hillsborough, Pasco, Pinellas), opening doors since 2007,
  24/7 emergency, same day repair, licensed GD13010 / GDI-09484, phone (813) 279-6785.

## Your job

Design the best-fit **Book a Repair** page around this single mechanism — hero, hierarchy,
sections, trust elements, how (or whether) to explain the steps, where the Book Online button
lives, how you frame the handoff to Housecall Pro, the call/estimate alternatives, and the mobile
experience. **Make the layout and visual calls yourself.** Don't ask me to spec the layout — own
it. Just keep it true to the embed above (no fake calendar, no custom form; the button launches
the HCP modal).
