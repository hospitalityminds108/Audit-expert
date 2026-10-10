import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import { getSession, safeNextPath } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AuditExpert account to manage bookings and reports.",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  if (getSession()) redirect(safeNextPath(searchParams?.next));

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Sign in to your account"
      lead="Pick up where you left off — your bookings, references and saved details are waiting."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
