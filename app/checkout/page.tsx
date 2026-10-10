import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Configure and pay for your audit booking.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="">
      <CheckoutClient />
    </div>
  );
}
