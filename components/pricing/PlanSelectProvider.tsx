"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getPlanBySlug } from "@/data/audit-plans";
import PlanSelectModal from "./PlanSelectModal";

interface PlanSelectContextValue {
  /** Open the plan popup for a plan slug */
  openPlan: (slug: string) => void;
  closePlan: () => void;
}

const PlanSelectContext = createContext<PlanSelectContextValue>({
  openPlan: () => {},
  closePlan: () => {},
});

export function usePlanSelect() {
  return useContext(PlanSelectContext);
}

/**
 * PlanSelectProvider — one plan popup for the whole app. Any "Select plan"
 * button calls `openPlan(slug)`; the popup handles configuration and hand-off
 * to the callback request form.
 */
export default function PlanSelectProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);

  const openPlan = useCallback((next: string) => {
    if (getPlanBySlug(next)) setSlug(next);
  }, []);
  const closePlan = useCallback(() => setSlug(null), []);

  const value = useMemo(() => ({ openPlan, closePlan }), [openPlan, closePlan]);
  const plan = slug ? getPlanBySlug(slug) : undefined;

  return (
    <PlanSelectContext.Provider value={value}>
      {children}
      {plan && <PlanSelectModal key={plan.slug} plan={plan} onClose={closePlan} />}
    </PlanSelectContext.Provider>
  );
}
