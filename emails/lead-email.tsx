import { Html, Head, Preview, Body, Container, Heading, Text, Section, Hr } from "@react-email/components";

export type LeadEmailProps = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  service?: string;
  message?: string;
};

export function LeadEmail({ name, phone, email, city, service, message }: LeadEmailProps) {
  const rows: Array<[string, string | undefined]> = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["City", city],
    ["Service", service],
  ];

  return (
    <Html>
      <Head />
      <Preview>{`New lead: ${name} — ${service ?? "garage door"}`}</Preview>
      <Body style={{ backgroundColor: "#f2f0ec", fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: "24px" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "2px solid #1a1a1a", borderRadius: "8px", maxWidth: "560px", margin: "0 auto", overflow: "hidden" }}>
          <Section style={{ backgroundColor: "#1a1a1a", padding: "18px 24px" }}>
            <Heading style={{ color: "#ffffff", fontSize: "18px", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
              New Website Lead
            </Heading>
          </Section>
          <Section style={{ padding: "20px 24px" }}>
            {rows.map(([label, value]) =>
              value ? (
                <Text key={label} style={{ margin: "0 0 8px", fontSize: "14px", color: "#1a1a1a" }}>
                  <strong style={{ display: "inline-block", width: "76px", color: "#b8202a" }}>{label}</strong>
                  {value}
                </Text>
              ) : null,
            )}
            {message ? (
              <>
                <Hr style={{ borderColor: "#e3e0da", margin: "12px 0" }} />
                <Text style={{ fontSize: "14px", lineHeight: 1.5, color: "#1a1a1a", margin: 0 }}>{message}</Text>
              </>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
