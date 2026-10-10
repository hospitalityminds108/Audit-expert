import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import { getSession, safeNextPath } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an AuditExpert account to book audits faster and keep every report in one place.",
  robots: { index: false, follow: false },
};

export default function SignupPage({ searchParams }: { searchParams?: { next?: string } }) {
  if (getSession()) redirect(safeNextPath(searchParams?.next));

  return (
    <AuthShell
      eyebrow="CREATE ACCOUNT"
      title="Start with a free account"
      lead="It takes under a minute. Book audits faster and keep every booking reference in one place."
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
