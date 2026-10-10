"use client";

import type { ReactNode } from "react";
import SmoothScrollProvider from "./SmoothScrollProvider";
import LenisGSAPBridge from "./LenisGSAPBridge";
import AuthProvider from "@/components/auth/AuthProvider";
import PlanSelectProvider from "@/components/pricing/PlanSelectProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <LenisGSAPBridge />
      <AuthProvider>
        <PlanSelectProvider>{children}</PlanSelectProvider>
      </AuthProvider>
    </SmoothScrollProvider>
  );
}
