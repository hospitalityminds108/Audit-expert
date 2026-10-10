export const siteConfig = {
  name: "AuditExpert",
  legalName: "AuditExpert — A HospitalityMinds Company",
  company: "HospitalityMinds",
  tagline: "See what your customers experience. Know what your teams actually deliver.",
  description:
    "Mystery audits and revealed SOP audits for hotels, restaurants, hospitals, malls, cinemas, salons and service brands — with structured scorecards, evidence and actionable recommendations.",
  url: "https://digital-hm-71s3.vercel.app",
  urlProduction: "https://auditexpert.in",
  email: "audits@auditexpert.in",
  phone: "+91 98200 00000",
  baseCity: "Mumbai, India",
  keywords: [
    "hotel mystery audit",
    "hotel service audit",
    "hotel SOP audit",
    "restaurant mystery audit",
    "restaurant service audit",
    "hospital patient experience audit",
    "retail mystery shopping",
    "cinema mystery audit",
    "salon mystery audit",
    "service standards audit",
    "customer experience audit",
    "SOP compliance audit",
    "mystery audit company India",
    "multi location audit program"
  ]
} as const;

export const heroConfig = {
  eyebrow: "AUDIT EXPERT",
  subEyebrow: "SERVICE INTELLIGENCE PLATFORM",
  headline: ["SEE WHAT YOUR", "CUSTOMERS EXPERIENCE.", "KNOW WHAT YOUR TEAMS", "ACTUALLY DELIVER."],
  supporting:
    "Mystery audits and revealed SOP audits for hotels, restaurants, hospitals, malls, cinemas, salons and service brands — with structured scorecards, evidence and actionable recommendations.",
  ctaPrimary: { label: "Find My Industry Audit", href: "/industries" },
  ctaSecondary: { label: "Join the Auditor Network", href: "/join-as-auditor" },
  stats: [
    { value: 6, suffix: "", label: "Industries audited" },
    { value: 100, suffix: "+", label: "Auditor network slots" },
    { value: 40, suffix: "+", label: "Audit checkpoints / journey" },
    { value: 100, suffix: "%", label: "Evidence-backed findings" }
  ]
} as const;

export const integrityStandards = [
  { principle: "Evidence", standard: "Findings are linked to documented observations, approved evidence or verifiable records." },
  { principle: "Confidentiality", standard: "Client information, audit assignments and sensitive evidence are handled on a need-to-know basis." },
  { principle: "Independence", standard: "Auditors disclose relevant conflicts and must not manipulate findings to please a client or audited team." },
  { principle: "Fair reporting", standard: "Reports show strengths as well as failures and distinguish observed fact from professional judgement." },
  { principle: "Competence", standard: "Auditors are matched to sectors and assignments based on training, experience and required expertise." },
  { principle: "Review", standard: "Reports pass internal quality review before final release for applicable programs." }
] as const;

export const futurePlatform = [
  { title: "Client Dashboard", description: "One view of every audit, score, location and action across your brand." },
  { title: "Auditor App", description: "Assignment briefs, checklists, evidence capture and submissions on the go." },
  { title: "GPS / Timestamp Evidence", description: "Location and time verification where permitted by assignment and law." },
  { title: "Location Benchmarking", description: "Compare every unit on one framework, city by city." },
  { title: "Recurring Audit Scheduler", description: "Automate monthly, quarterly and annual audit calendars." },
  { title: "Corrective Action Closure", description: "Track owners, deadlines and closure status for every gap." },
  { title: "Auditor Ratings", description: "Quality checks and ratings keep the network sharp and accountable." },
  { title: "Global Auditor Network", description: "A city-by-city network ready to scale across markets." }
] as const;

export const brandProgramFeatures = [
  { title: "Location Score", description: "Compare every unit on one framework" },
  { title: "Brand Score", description: "Overall standards performance" },
  { title: "Repeat Gaps", description: "Issues recurring across locations" },
  { title: "Action Tracker", description: "Owner, deadline and closure status" },
  { title: "Trend View", description: "Month / quarter improvement" },
  { title: "Leadership Report", description: "Executive summary and priorities" }
] as const;

export const reportDeliverables = [
  { title: "Executive audit score", detail: "One number leadership sees first" },
  { title: "Section-by-section scorecard", detail: "Front office, housekeeping, F&B and beyond" },
  { title: "Evidence / observations", detail: "Every finding tied to what was seen" },
  { title: "Critical gaps", detail: "Where the experience breaks down" },
  { title: "What went well", detail: "Strengths worth protecting" },
  { title: "Corrective recommendations", detail: "Practical, prioritised actions" },
  { title: "Priority levels", detail: "Critical / high / medium / low" },
  { title: "Management debrief", detail: "For applicable plans, with your team" }
] as const;
