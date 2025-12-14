import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
  Link,
} from "@react-email/components";

interface CreditEmailProps {
  firstName: string;
  creditUrl: string;
  code: string;
  amount: number;
}

export const CreditEmail = ({
  firstName,
  creditUrl,
  code,
  amount,
}: CreditEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{`You've received $${amount} in Cursor credits!`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Cafe Cursor</Text>
          </Section>

          {/* Hero Section */}
          <Section style={heroSection}>
            <Text style={heroTitle}>Your credits are ready</Text>
            <Text style={heroSubtitle}>
              Thanks for joining us, {firstName}
            </Text>
          </Section>

          {/* Credit Amount Card */}
          <Section style={creditCard}>
            <Text style={creditLabel}>Credit Amount</Text>
            <Text style={creditAmount}>${amount}</Text>
            <Text style={creditDescription}>
              Ready to redeem on Cursor
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Button style={primaryButton} href={creditUrl}>
              Redeem Your Credits
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Tenfold CTA */}
          <Section style={tenfoldSection}>
            <Text style={tenfoldTitle}>Want more events like this?</Text>
            <Text style={tenfoldDescription}>
              Join Tenfold - Victoria's tech builder community. Every Tuesday at 6PM.
            </Text>
            <Button style={tenfoldButton} href="https://www.tenfoldvictoria.com/">
              Join Tenfold
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              If the button doesn't work, copy and paste this URL:
            </Text>
            <Link href={creditUrl} style={footerLink}>
              {creditUrl}
            </Link>
            <Text style={copyright}>
              Cafe Cursor - Building the future in the wild
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#0a0a0a",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "16px",
  border: "1px solid #1a1a1a",
  overflow: "hidden",
};

const header = {
  padding: "32px 48px 16px",
  borderBottom: "1px solid #1a1a1a",
};

const logo = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0",
  letterSpacing: "-0.5px",
};

const heroSection = {
  padding: "24px 48px 24px",
  textAlign: "center" as const,
};

const heroTitle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0 0 12px",
  letterSpacing: "-1px",
  lineHeight: "1.2",
};

const heroSubtitle = {
  fontSize: "16px",
  color: "#888888",
  margin: "0",
  lineHeight: "1.5",
};

const creditCard = {
  margin: "0 48px 24px",
  padding: "24px",
  backgroundColor: "#111111",
  borderRadius: "12px",
  border: "1px solid #222222",
  textAlign: "center" as const,
};

const creditLabel = {
  fontSize: "12px",
  fontWeight: "500",
  color: "#666666",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const creditAmount = {
  fontSize: "48px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0 0 8px",
  letterSpacing: "-2px",
  lineHeight: "1",
};

const creditDescription = {
  fontSize: "14px",
  color: "#888888",
  margin: "0",
};

const ctaSection = {
  padding: "0 48px 32px",
  textAlign: "center" as const,
};

const primaryButton = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  color: "#000000",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  border: "none",
};

const codeSection = {
  padding: "0 48px 32px",
  textAlign: "center" as const,
};

const codeLabel = {
  fontSize: "12px",
  fontWeight: "500",
  color: "#666666",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const codeBox = {
  backgroundColor: "#111111",
  borderRadius: "8px",
  border: "1px solid #222222",
  padding: "16px 24px",
  display: "inline-block",
};

const codeText = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0",
  fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
  letterSpacing: "3px",
};

const divider = {
  borderColor: "#1a1a1a",
  margin: "0 48px",
};

const tenfoldSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
  backgroundColor: "#0d0d0d",
};

const tenfoldTitle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 8px",
  letterSpacing: "-0.5px",
};

const tenfoldDescription = {
  fontSize: "14px",
  color: "#888888",
  margin: "0 0 20px",
  lineHeight: "1.5",
};

const tenfoldButton = {
  backgroundColor: "transparent",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "1px solid #333333",
};

const footerSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#555555",
  margin: "0 0 8px",
};

const footerLink = {
  fontSize: "12px",
  color: "#666666",
  wordBreak: "break-all" as const,
  textDecoration: "underline",
};

const copyright = {
  fontSize: "12px",
  color: "#444444",
  margin: "24px 0 0",
};

export default CreditEmail;
