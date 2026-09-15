import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Cookie Policy — AuditExpert",
  description:
    "What cookies the AuditExpert website uses, why, and how to control them.",
};

export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      updated="February 2025"
      intro={`${siteConfig.name} uses a minimal set of cookies and local storage entries — only what the site needs to remember your choices, keep checkout secure and understand aggregate usage. No advertising trackers.`}
      sections={[
        {
          heading: "What we set",
          paragraphs: [
            "Strictly necessary entries: your checkout selections (chosen plan, locations, add-ons, applied coupon) are held in your browser's local storage so a refresh does not lose your configuration. Session security entries protect forms and checkout from abuse (rate limiting).",
            "Preference entries remember choices you explicitly make, such as a dismissed notice or a reduced-motion preference your device already signals to us.",
          ],
        },
        {
          heading: "What we do not set",
          paragraphs: [
            "We do not run third-party advertising or cross-site tracking cookies. We do not sell browsing data. Analytics, if enabled, is aggregate and cookieless.",
          ],
        },
        {
          heading: "Payment provider",
          paragraphs: [
            "When you pay online, our payment provider (Razorpay) may set strictly necessary cookies inside its own checkout window to keep your transaction secure. These are governed by the provider's policy, not this one.",
          ],
        },
        {
          heading: "Managing cookies",
          paragraphs: [
            "You can clear or block cookies and local storage in your browser settings at any time. Blocking strictly necessary entries will reset your checkout configuration on refresh but will not break the rest of the site.",
          ],
        },
      ]}
    />
  );
}
