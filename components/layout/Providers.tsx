"use client";

import type { ReactNode } from "react";
import ScrollTriggerRefresh from "./ScrollTriggerRefresh";
import AuthProvider from "@/components/auth/AuthProvider";
import PlanSelectProvider from "@/components/pricing/PlanSelectProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ScrollTriggerRefresh />
      <PlanSelectProvider>{children}</PlanSelectProvider>
    </AuthProvider>
  );
}
