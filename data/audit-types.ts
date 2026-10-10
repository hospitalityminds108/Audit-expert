import { ClipboardCheck, Eye, type LucideIcon } from "lucide-react";
import { auditPlans, type AuditFormat } from "./audit-plans";
import { twoWays } from "./navigation";

export interface AuditTypeNav {
  format: AuditFormat;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Number of plans offered in this format */
  count: number;
}

/** The two audit formats, for the header and mobile menus. */
export function getAuditTypesNav(): AuditTypeNav[] {
  const count = (format: AuditFormat) => auditPlans.filter((p) => p.format === format).length;
  return [
    {
      format: "mystery",
      label: "Mystery Audit",
      description: `${twoWays.mystery.sub} — an unannounced visit by an auditor acting as a normal customer.`,
      icon: Eye,
      count: count("mystery"),
    },
    {
      format: "sop",
      label: "Revealed / SOP Audit",
      description: `${twoWays.sop.sub} — an announced audit of SOPs, systems and team readiness.`,
      icon: ClipboardCheck,
      count: count("sop"),
    },
  ];
}
