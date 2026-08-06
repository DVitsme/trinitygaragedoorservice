import { Html, Head, Preview, Body, Container, Heading, Text, Section, Hr } from "@react-email/components";

export type LeadEmailProps = {
  name: string;
  phone: string;
  email?: string;
  zip?: string;
  city?: string;
  service?: string;
  message?: string;
  source?: string;
};

/**
 * `zip` and `source` were added 2026-08-04 and are both fixes, not decoration.
 *
 * **Zip** was already being collected and stored, and the office never saw it. Simone kept that
 * field over Lloyd's objection for one stated reason, that Jason's team "are going to want to know
 * where they're located", and this email is the only thing they read. It was reaching D1 and
 * stopping there.
 *
 * **Source** names the form the lead came from, e.g. `spring-repair-form`. Every booking CTA now
 * lands on a request form page of its own (see `lib/booking.ts`), so this row tells whoever picks
 * up the phone what the customer was reading a second before they filled it in.
 */

export function LeadEmail({ name, phone, email, zip, city, service, message, source }: LeadEmailProps) {
  const rows: Array<[string, string | undefined]> = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["Zip", zip],
    ["City", city],
    ["Service", service],
    ["Came from", source],
  ];

  return (
    <Html>
      <Head />
      <Preview>{`New lead: ${name}, ${service ?? "garage door"}, ${phone}`}</Preview>
      <Body style={{ backgroundColor: "#f2f0ec", fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: "24px" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "2px solid #1a1a1a", borderRadius: "8px", maxWidth: "560px", margin: "0 auto", overflow: "hidden" }}>
          <Section style={{ backgroundColor: "#1a1a1a", padding: "18px 24px" }}>
            <Heading style={{ color: "#ffffff", fontSize: "18px", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
              New Website Lead
            </Heading>
          </Section>
          <Section style={{ padding: "20px 24px" }}>
            {/*
              The label ends with a colon on purpose. The visual gap comes from `width: 76px`, which
              is CSS, and Resend generates a text/plain alternative with the CSS stripped. Without
              the colon that version rendered as "Name(813) 555-0100", label jammed into value, in
              any client showing plain text.

              Phone and email are real links so the office can tap to call straight from the
              notification, which is the entire purpose of this email.
            */}
            {rows.map(([label, value]) =>
              value ? (
                <Text key={label} style={{ margin: "0 0 8px", fontSize: "14px", color: "#1a1a1a" }}>
                  <strong style={{ display: "inline-block", width: "76px", color: "#b8202a" }}>{label}:</strong>
                  {label === "Phone" ? (
                    <a href={`tel:${value.replace(/\D/g, "")}`} style={{ color: "#1a1a1a", fontWeight: 700 }}>{value}</a>
                  ) : label === "Email" ? (
                    <a href={`mailto:${value}`} style={{ color: "#1a1a1a" }}>{value}</a>
                  ) : (
                    value
                  )}
                </Text>
              ) : null,
            )}
            {message ? (
              <>
                <Hr style={{ borderColor: "#e3e0da", margin: "12px 0" }} />
                {/*
                  `pre-wrap` is load bearing, not styling. Without it HTML collapses the customer's
                  line breaks and their description arrives as one run-on block. Someone typing
                  "Door won't open." / "Spring looks broken." / "Can you come Tuesday?" on three
                  lines is the normal case, and the office reads this to decide what van to send.
                  Confirmed against a real delivered message on 2026-08-01.
                */}
                <Text
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#1a1a1a",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message}
                </Text>
              </>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
