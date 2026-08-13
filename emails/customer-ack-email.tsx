import {
  Html, Head, Preview, Body, Container, Heading, Text, Section, Hr, Img, Link,
} from "@react-email/components";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export type CustomerAckEmailProps = {
  /** First name only. The form does not collect a surname, on purpose. */
  firstName: string;
  /** What they picked from the dropdown, if they picked anything. Optional by design. */
  service?: string;
  /** Echoed back so they can see we read it, and so they can spot their own typo. */
  message?: string;
  /** Their phone as we stored it, so a mistyped digit is visible to them immediately. */
  phone?: string;
};

/**
 * The first touch reply to the customer.
 *
 * ⚠️ **This is the first email this site has ever sent to a customer.** Until 2026-08-12 the route
 * sent exactly one email, to the office, with `replyTo` set to the customer. The comment at the top
 * of `app/thank-you/page.tsx` recorded that and warned the page must never promise a confirmation,
 * because none existed. That is now false and both were updated together. If this email is ever
 * removed, change them back.
 *
 * ## What it deliberately does NOT say
 *
 * No price, no warranty, no guarantee, and no arrival time. `copy/services/_VOICE-AND-RULES.md`
 * forbids inventing any of those, and the two hour arrival window is only decided once the office
 * knows what the job is, so promising one here would be a claim we cannot keep. The two hour window
 * is described as what happens NEXT, not as something already booked.
 *
 * No unsubscribe link, and that is correct rather than an oversight. This is a transactional reply
 * to somebody who just asked to be contacted, not marketing. Adding a marketing style footer would
 * make it look like a mailing list and invite spam reports on a domain that also carries the
 * office's lead notifications.
 *
 * ## Why the copy mirrors `/thank-you/`
 *
 * Somebody who submits the form sees that page and then gets this. If the two disagree in tone or
 * in what they promise, the email reads as an automated afterthought. The headline, the "real
 * person, not a call centre" line and the two hour window are all deliberately the same claims in
 * the same order, because they are the same promise made twice.
 *
 * ⚠️ **House copy rule applies: no dashes of any kind.** No em dash, no en dash, no hyphen.
 */
export function CustomerAckEmail({ firstName, service, message, phone }: CustomerAckEmailProps) {
  const tel = SITE.phoneDisplay;
  const telHref = `tel:${SITE.phoneDisplay.replace(/\D/g, "")}`;

  return (
    <Html dir="ltr" lang="en">
      <Head />
      {/*
        The preview line is the second thing they read, after the subject, and in Gmail it sits
        right beside it. It repeats the promise rather than the brand, because "we will call you"
        is the only thing they actually want to know at this moment.
      */}
      <Preview>A real person will call you back, usually the same day.</Preview>
      <Body style={body}>
        <Container style={card}>
          {/*
            ⚠️ **Hosted, not a base64 data URI, and not a CID attachment.**

            Inlining as base64 would add roughly a third again to every send, and Gmail clips a
            message over 102 KB behind a "View entire message" link, which would hide the phone
            number below it. A hosted https image is what every mail client expects.

            ⚠️ **`email-crew-branded-polo.jpg` is a purpose made crop and not one of the site
            images.** It is `svc-crew-branded-polo.jpg` cropped to 3:2 and resized to 1200x800, so
            it renders 600x400 and stays crisp on a retina screen. The 3:2 matters: the source is
            5:4, which at 600px wide is 480px tall and pushes the headline out of a preview pane.
            123 KB against the source's 202 KB.

            **Why this photograph specifically.** The logo and the phone number are printed across
            the back of the polo, so the branding is on the person doing the work rather than
            pasted on. The rest of the crew is visible behind him, which says "a real company turned
            up" better than any sentence here could.

            ⚠️ **`height` is set as well as `width`.** Outlook needs both or it reserves no space and
            the layout jumps. Many clients also block remote images until the reader allows them, so
            this image carries NO information: everything that matters is text below it. If it never
            loads, nothing is lost but the photograph.
          */}
          <Img
            src={absoluteUrl("/assets/email-crew-branded-polo.jpg")}
            width="600"
            height="400"
            alt="A Trinity Garage Door Service technician, the company logo and phone number across the back of his polo shirt, working with the crew on a garage door"
            style={hero}
          />

          <Section style={pad}>
            <Heading style={h1}>Hello {firstName},</Heading>
            <Text style={lede}>
              Thank you for reaching out! We are excited to get started working with you and will be
              in contact as soon as possible.
            </Text>

            <Section style={callout}>
              <Text style={calloutLabel}>Need us sooner?</Text>
              <Link href={telHref} style={calloutPhone}>{tel}</Link>
              <Text style={calloutSub}>Phones answered till 9pm</Text>
            </Section>

            {/*
              ⚠️ **The most important block in this email, and it is styled to be impossible to
              skim past.** Distinct background, its own border, larger and bolder than the body.

              The wording is deliberately "unmonitored" rather than "your reply will be lost",
              because `sendCustomerAck` DOES set replyTo to the office, so a reply does currently
              arrive. Saying otherwise would be a false statement to a customer. What is true is
              that nobody reads the noreply mailbox itself, that the From address tells the reader
              this is a dead end, and that a single careless edit to replyTo would make a reply
              vanish with no error anywhere. Giving them an address a human actually watches is the
              honest and durable answer.

              ⚠️ **Keep replyTo set even though this notice exists.** It is the safety net for the
              customer who hits reply without reading. Never close a route into this business.
            */}
            <Section style={notice}>
              <Text style={noticeHead}>Please do not reply to this email</Text>
              <Text style={noticeBody}>
                It is sent from an address nobody checks. To reach us, write to:
              </Text>
              <Link href="mailto:trinitygaragedoorservice@gmail.com" style={noticeMail}>
                trinitygaragedoorservice@gmail.com
              </Link>
            </Section>

            {/*
              Their own words, read back. Two reasons, and the second is the useful one: it shows we
              actually received what they wrote, and it lets them catch their own mistyped phone
              number while they are still thinking about it. A wrong digit here is the single most
              common way a real lead becomes uncontactable.
            */}
            {(message || phone || service) && (
              <>
                <Hr style={rule} />
                <Text style={recapLabel}>Our records show:</Text>
                {service && <Text style={recapRow}><strong style={recapKey}>Service</strong>{service}</Text>}
                {phone && <Text style={recapRow}><strong style={recapKey}>Phone</strong>{phone}</Text>}
                {message && <Text style={recapMsg}>{message}</Text>}
                {/*
                  Names the address rather than saying "above" or "below". The notice block has
                  already moved once during review, and a direction word silently points the wrong
                  way the moment anything is reordered. Repeating the address costs one line and it
                  is the single thing in this email we most want repeated.
                */}
                <Text style={recapNote}>
                  If anything above is wrong, email trinitygaragedoorservice@gmail.com and we will
                  put it right.
                </Text>
              </>
            )}
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Trinity Garage Door Service, family owned in Lutz since 2007
            </Text>
            <Text style={footerFine}>
              Licensed, bonded and insured. FL GD13010 and GDI-09484
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/*
  Inline styles only, and no flex or grid anywhere. Outlook renders through
  Word, which supports neither, and a <style> block is stripped by several clients including Gmail
  on mobile. Colours are the Bold Trade tokens from `app/globals.css`, hardcoded because an email
  cannot read a CSS custom property.
*/
const INK = "#1a1a1a";
const ACCENT = "#b8202a";
const SAND = "#f2f0ec";
const BODY = "#4a4a4a";

const body = { backgroundColor: SAND, margin: 0, padding: 0, fontFamily: "Arial, Helvetica, sans-serif" } as const;
const card = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", border: `2px solid ${INK}`, borderRadius: "8px", overflow: "hidden" } as const;
const hero = { width: "100%", maxWidth: "600px", height: "auto", display: "block", objectFit: "cover" } as const;
const pad = { padding: "28px 28px 8px" } as const;

const h1 = { color: INK, fontSize: "26px", lineHeight: "1.15", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 800 } as const;
const lede = { color: BODY, fontSize: "16px", lineHeight: "1.55", margin: "0 0 22px" } as const;

const callout = { backgroundColor: SAND, borderLeft: `4px solid ${ACCENT}`, padding: "14px 18px", margin: "0 0 4px" } as const;
const calloutLabel = { color: BODY, fontSize: "13px", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 } as const;
const calloutPhone = { color: ACCENT, fontSize: "24px", fontWeight: 800, textDecoration: "none", lineHeight: "1.2" } as const;
const calloutSub = { color: BODY, fontSize: "13px", margin: "4px 0 0" } as const;

const rule = { border: "none", borderTop: "1px solid #e3e0da", margin: "24px 0" } as const;


const recapLabel = { color: INK, fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" } as const;
const recapRow = { color: INK, fontSize: "14px", lineHeight: "22px", margin: "0 0 4px" } as const;
const recapKey = { display: "inline-block", width: "74px", color: ACCENT } as const;
const recapMsg = { color: BODY, fontSize: "14px", lineHeight: "1.5", margin: "10px 0 0", whiteSpace: "pre-wrap" } as const;
const recapNote = { color: BODY, fontSize: "13px", lineHeight: "1.45", margin: "12px 0 0", fontStyle: "italic" } as const;

/*
  The notice. Everything here is one step louder than the body copy on purpose: a warmer background
  than the sand callout above it so the two do not read as the same thing, a full accent border
  rather than a left rule, and type that steps up rather than down. If this ever stops standing out
  from the block above it, the styling has failed at its only job.
*/
const notice = { backgroundColor: "#fdecec", border: `2px solid ${ACCENT}`, borderRadius: "6px", padding: "18px 20px", margin: "20px 0 4px" } as const;
const noticeHead = { color: ACCENT, fontSize: "18px", fontWeight: 800, margin: "0 0 6px", lineHeight: "1.3" } as const;
const noticeBody = { color: INK, fontSize: "16px", fontWeight: 700, margin: "0 0 8px", lineHeight: "1.45" } as const;
const noticeMail = { color: ACCENT, fontSize: "19px", fontWeight: 800, textDecoration: "underline", wordBreak: "break-all" } as const;

const footer = { backgroundColor: INK, padding: "16px 28px" } as const;
const footerText = { color: "#ffffff", fontSize: "13px", margin: 0 } as const;
const footerFine = { color: "#b9b9b9", fontSize: "12px", margin: "4px 0 0" } as const;
