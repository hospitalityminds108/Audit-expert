import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service — AuditExpert",
  description:
    "Terms governing audit engagements, bookings, payments and use of the AuditExpert website.",
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      updated="February 2025"
      intro={`These terms govern your use of the ${siteConfig.name} website and any audit engagement you book through it. By booking an audit or using the site you accept these terms.`}
      sections={[
        {
          heading: "Services",
          paragraphs: [
            "AuditExpert provides mystery audits and revealed SOP audits for hospitality and service businesses, including structured scorecards, evidence capture and written reports. The specific scope of each engagement is defined at booking or on the scheduling call.",
            "Audit plans shown on this website describe typical scope and indicative pricing. Final scope, locations and pricing are confirmed at checkout or on your scheduling call before payment is captured.",
          ],
        },
        {
          heading: "Bookings and payment",
          paragraphs: [
            "Online bookings are confirmed only after payment is verified on our server. You receive a booking reference (format AE-YYYY-XXXXXX), a confirmation email and an invoice with GST shown separately.",
            "Prices include the audit fee for the locations configured plus any add-ons selected; 18% GST is applied at checkout. Volume rates apply automatically at 3+ and 5+ locations as shown at checkout.",
            "Coupons are single-use per client unless stated otherwise, cannot be combined, and are validated server-side at checkout.",
          ],
        },
        {
          heading: "Cancellation and rescheduling",
          paragraphs: [
            "Rescheduling: you may reschedule an audit at no cost up to 72 hours before the scheduled window by replying to your confirmation email or calling us.",
            "Cancellation: cancellations more than 7 days before the audit window receive a full refund minus payment-gateway charges. Within 7 days, 50% is refundable. Within 72 hours, the fee is non-refundable because auditor time and logistics are already committed.",
            "If AuditExpert must cancel for reasons within our control, you receive a full refund or a free rescheduled audit, at your choice.",
          ],
        },
        {
          heading: "Reports and evidence",
          paragraphs: [
            "Reports are prepared with professional care and reflect observations and evidence captured during the audit window. They are advisory documents for management use; they do not constitute legal certification, financial audit or regulatory compliance opinion.",
            "Report delivery timelines (typically within 72 hours of the audit) are indicative and confirmed at scheduling. Evidence material is licensed to the commissioning client for internal use and may not be republished commercially.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "You may not attempt to probe, scrape at volume, overload or reverse-engineer the site, forms or checkout, or submit fraudulent bookings or payments. Rate limits and server-side price calculation protect the integrity of the service.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "To the extent permitted by law, AuditExpert's total liability for any engagement is limited to the fee paid for that engagement. We are not liable for indirect or consequential losses.",
            "Nothing in these terms limits liability that cannot be limited by law.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.",
          ],
        },
      ]}
    />
  );
}
