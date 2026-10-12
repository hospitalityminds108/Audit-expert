"use client";

import type { ReactNode } from "react";
import ScrollTriggerRefresh from "./ScrollTriggerRefresh";
import PlanSelectProvider from "@/components/pricing/PlanSelectProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollTriggerRefresh />
      <PlanSelectProvider>{children}</PlanSelectProvider>
    </>
  );
}
