"use client";

import type { ReactNode } from "react";
import SmoothScrollProvider from "./SmoothScrollProvider";
import LenisGSAPBridge from "./LenisGSAPBridge";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <LenisGSAPBridge />
      {children}
    </SmoothScrollProvider>
  );
}
