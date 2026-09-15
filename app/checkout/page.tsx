import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Checkout — ${siteConfig.name}`,
  description: "Configure and pay for your audit booking.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main id="main" className="bg-ink-950">
      <CheckoutClient />
    </main>
  );
}
