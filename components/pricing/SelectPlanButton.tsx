"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePlanSelect } from "./PlanSelectProvider";

interface Props {
  slug: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}

const sizes = {
  md: "px-6 py-3 text-[13px]",
  lg: "px-8 py-4 text-sm",
} as const;

/** Opens the plan popup for `slug`. */
export default function SelectPlanButton({ slug, children, variant = "primary", size = "md", className = "" }: Props) {
  const { openPlan } = usePlanSelect();
  return (
    <button
      type="button"
      onClick={() => openPlan(slug)}
      aria-haspopup="dialog"
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide ${
        variant === "primary" ? "btn-primary" : "btn-ghost"
      } ${sizes[size]} ${className}`}
    >
      {children}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}
