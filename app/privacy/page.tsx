import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy — AuditExpert",
  description:
    "How AuditExpert, a HospitalityMinds company, collects, uses and protects personal information across audits, bookings and this website.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="February 2025"
      intro={`This policy explains how ${siteConfig.legalName} ("AuditExpert", "we") handles personal information when you use this website, book an audit, or interact with our services. We collect the minimum we need to run a professional audit practice — and nothing more.`}
      sections={[
        {
          heading: "Information we collect",
          paragraphs: [
            "Contact and booking details you give us directly: name, email, phone, company, preferred audit dates and any notes you share through forms, checkout or callbacks.",
            "Payment-related information is processed by our payment provider (Razorpay). We receive only the payment reference and status — card numbers, UPI IDs and bank credentials never touch our servers.",
            "Basic technical data such as IP address and request timestamps, used solely for rate limiting and security of our forms and checkout.",
          ],
        },
        {
          heading: "How we use information",
          paragraphs: [
            "To scope, schedule and deliver audits you book; to send booking confirmations and invoices; to respond to inquiries; and to keep our auditor network coordinated.",
            "We do not sell, rent or trade personal information. We do not send unrelated marketing. You can ask us to delete your data at any time.",
          ],
        },
        {
          heading: "Audit evidence handling",
          paragraphs: [
            "Photographs, videos and observations captured during audits are linked to the commissioning client's engagement, stored on a need-to-know basis, and shared only with that client's named recipients.",
            "Auditor identity remains confidential in mystery-audit engagements unless disclosure is mutually agreed in writing.",
          ],
        },
        {
          heading: "Data retention",
          paragraphs: [
            "Booking and invoice records are retained as required by Indian tax and accounting rules. Form submissions that do not convert into engagements are purged within 12 months.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Under India's Digital Personal Data Protection Act and comparable principles, you may request access, correction or erasure of your personal data, and withdraw consent for future contact.",
            `Send requests to ${siteConfig.email} from the email you used, and we will act within 30 days.`,
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "We use only what the site needs to function (see our Cookie Policy). We do not run third-party advertising trackers.",
          ],
        },
      ]}
    />
  );
}
