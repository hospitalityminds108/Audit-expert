import { redirect } from "next/navigation";

/** /pricing is a friendly alias for the plans & pricing page. */
export default function PricingPage() {
  redirect("/audit-plans");
}
