export const navigation = {
  primary: [
    { label: "Industries", href: "/industries", children: "industries" },
    { label: "Audit Plans", href: "/audit-plans", children: "plans" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Join as Auditor", href: "/join-as-auditor" }
  ],
  cta: { label: "Book an Audit", href: "/book-an-audit" },
  footer: {
    nav: [
      { label: "Industries", href: "/industries" },
      { label: "Audit Plans", href: "/audit-plans" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "About", href: "/about" },
      { label: "Join as Auditor", href: "/join-as-auditor" },
      { label: "Book an Audit", href: "/book-an-audit" },
      { label: "Contact", href: "/contact" }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" }
    ]
  }
} as const;

export const methodologySteps = [
  {
    number: "01",
    title: "DEFINE",
    description: "Objectives, scope, journey, standards"
  },
  {
    number: "02",
    title: "DESIGN",
    description: "Industry checklist and scoring"
  },
  {
    number: "03",
    title: "ASSIGN",
    description: "Qualified auditor matched to assignment"
  },
  {
    number: "04",
    title: "AUDIT",
    description: "Visit, observe, test and document"
  },
  {
    number: "05",
    title: "VERIFY",
    description: "Evidence and report quality review"
  },
  {
    number: "06",
    title: "IMPROVE",
    description: "Score, actions, re-audit and trend"
  }
] as const;

export const auditorTypes = [
  "Mystery shoppers",
  "Hospitality professionals",
  "Quality / SOP professionals",
  "Customer-experience specialists",
  "Ex-hotel / restaurant managers",
  "Healthcare service professionals",
  "Retail / mall professionals",
  "Trained independent evaluators"
] as const;

export const twoWays = {
  eyebrow: "TWO WAYS TO SEE THE TRUTH",
  headline: "MYSTERY WHEN YOU WANT REALITY. REVEALED WHEN YOU WANT DEPTH.",
  intro:
    "Both audit formats use industry-specific checklists, evidence, scoring and management recommendations. The difference is how the audit is conducted.",
  mystery: {
    label: "MYSTERY AUDIT",
    sub: "The customer view",
    description:
      "An auditor behaves like a normal guest, shopper, patient, diner or visitor so your team does not know they are being evaluated.",
    points: [
      { title: "Real customer journey", detail: "The visit unfolds exactly as a normal guest would experience it" },
      { title: "Service behavior & response time", detail: "Timed measurements of how teams respond when nobody is watching" },
      { title: "Sales / upselling quality", detail: "How recommendations and conversions actually happen" },
      { title: "Cleanliness, presentation & ambience", detail: "First-impression standards through the guest's eyes" },
      { title: "Brand-standard checks", detail: "Compliance with your standards, observed naturally" },
      { title: "Evidence-backed report", detail: "Every finding tied to a checkpoint and observation" }
    ],
    image: "/images/sections/mystery.jpg",
    cta: { label: "Explore Mystery Audits", href: "/audit-plans?format=mystery" }
  },
  sop: {
    label: "REVEALED / SOP AUDIT",
    sub: "The management view",
    description:
      "An announced professional audit that evaluates SOPs, systems, documentation, service delivery, team readiness and management controls.",
    points: [
      { title: "SOP compliance", detail: "Every documented process checked against actual practice" },
      { title: "Process & documentation checks", detail: "Logs, records and systems reviewed" },
      { title: "HOD / manager interaction", detail: "Structured interviews with department heads" },
      { title: "Training-gap identification", detail: "Where readiness falls short of standards" },
      { title: "Physical standards inspection", detail: "Facilities checked against specification" },
      { title: "Corrective-action plan", detail: "A practical roadmap with owners and priorities" }
    ],
    image: "/images/sections/sop.jpg",
    cta: { label: "Explore SOP Audits", href: "/audit-plans?format=sop" }
  }
} as const;

export const testimonials = [
  {
    quote:
      "The mystery stay report read like our own brand manual annotated with reality. Every finding had a timestamp. Nothing was opinion.",
    author: "General Manager",
    context: "Five-star hotel, Mumbai",
    metric: "+11 pts", 
    metricLabel: "guest score in 2 quarters"
  },
  {
    quote:
      "Six outlets, one framework, one leadership report. For the first time we could see which location was actually consistent.",
    author: "Operations Head",
    context: "Restaurant chain, 6 cities",
    metric: "6 → 1",
    metricLabel: "reports consolidated"
  },
  {
    quote:
      "Patient-facing teams changed how they work the front desk after the first debrief. The evidence made the argument for us.",
    author: "Patient Experience Lead",
    context: "Multi-specialty hospital, Pune",
    metric: "-38%",
    metricLabel: "front-desk wait complaints"
  }
] as const;
