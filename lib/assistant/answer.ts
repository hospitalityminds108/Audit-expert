/**
 * Site assistant — answers visitor questions from the website's own content
 * (plans, pricing, industries, FAQs, process, contact details).
 *
 * It is a retrieval assistant, not a generative model: every reply is built
 * from data in /data, so it cannot invent prices or policies. Questions it
 * can't match are handed to a person (WhatsApp, call or the callback form).
 */

import { auditPlans, formatPrice, planCategoryTabs, type AuditPlan } from "@/data/audit-plans";
import { industries } from "@/data/industries";
import { auditorFaqs, bookingFaqs, generalFaqs } from "@/data/faqs";
import { methodologySteps, twoWays } from "@/data/navigation";
import { reportDeliverables, siteConfig } from "@/data/site";

export interface AssistantLink {
  label: string;
  href: string;
}

export interface AssistantReply {
  text: string;
  links?: AssistantLink[];
  /** Follow-up questions offered as quick replies */
  suggestions?: string[];
}

export const STARTER_QUESTIONS = [
  "What does an audit cost?",
  "Mystery vs SOP audit?",
  "How does it work?",
  "Talk to a person",
] as const;

export const GREETING: AssistantReply = {
  text: `Hi — I'm the ${siteConfig.name} assistant. Ask me about audit plans, pricing, industries or how an audit runs.`,
  suggestions: [...STARTER_QUESTIONS],
};

const CONTACT_LINKS: AssistantLink[] = [
  { label: `WhatsApp ${siteConfig.whatsapp}`, href: siteConfig.whatsappHref },
  { label: `Call ${siteConfig.phone}`, href: siteConfig.phoneHref },
  { label: "Request a callback", href: "/book-an-audit#callback" },
];

/* ── text helpers ─────────────────────────────────────────── */

const STOP = new Set(
  "a an the is are was were be been do does did can could would should will i you we they it my your our me us of for to in on at by with and or but if what which who how when where why about from as this that there any some much many please tell want need get have has".split(" ")
);

const normalise = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9₹+ ]+/g, " ").replace(/\s+/g, " ").trim();

const tokens = (s: string) => normalise(s).split(" ").filter((t) => t.length > 1 && !STOP.has(t)).map(stem);

/** Light stemming so "audits", "auditing" and "audit" meet */
function stem(t: string): string {
  return t.replace(/(ing|ers|er|ies|es|s)$/, (m) => (m === "ies" ? "y" : "")) || t;
}

const has = (q: string, ...words: string[]) => words.some((w) => new RegExp(`(^| )${w}`).test(q));

/* ── entity matching ──────────────────────────────────────── */

const INDUSTRY_WORDS: Record<string, string[]> = {
  "hotels-resorts": ["hotel", "resort", "hospitality", "guest", "room", "stay"],
  "restaurants-cafes": ["restaurant", "cafe", "café", "dining", "diner", "food", "outlet", "qsr", "bar"],
  "hospitals-clinics": ["hospital", "clinic", "patient", "healthcare", "medical", "doctor"],
  "malls-retail": ["mall", "retail", "store", "shop", "shopping", "showroom"],
  cinemas: ["cinema", "multiplex", "movie", "theatre", "theater", "film"],
  "salons-spas": ["salon", "spa", "beauty", "parlour", "parlor", "wellness"],
};

function findIndustry(q: string) {
  for (const ind of industries) {
    const words = INDUSTRY_WORDS[ind.slug] ?? [];
    if (words.some((w) => has(q, w))) return ind;
  }
  return undefined;
}

function findPlan(q: string): AuditPlan | undefined {
  const qt = new Set(tokens(q));
  let best: AuditPlan | undefined;
  let bestScore = 0;
  for (const plan of auditPlans) {
    const nameTokens = tokens(plan.name);
    const hit = nameTokens.filter((t) => qt.has(t)).length;
    // every word of the plan name must appear, e.g. "hotel mystery 360"
    if (hit === nameTokens.length && hit > bestScore) {
      best = plan;
      bestScore = hit;
    }
  }
  return best;
}

const planLine = (p: AuditPlan) => `• ${p.name} — ${formatPrice(p.priceMin, p.priceMax)} / ${p.priceUnit}`;

/* ── replies ──────────────────────────────────────────────── */

function planReply(plan: AuditPlan): AssistantReply {
  return {
    text:
      `${plan.name} (${plan.format === "mystery" ? "mystery audit" : "revealed / SOP audit"}, ${plan.categoryLabel}): ${plan.description}\n\n` +
      `Published range: ${formatPrice(plan.priceMin, plan.priceMax)} / ${plan.priceUnit}, plus 18% GST. ${plan.priceNote}`,
    links: [
      { label: `View ${plan.name}`, href: `/audit-plans/${plan.slug}` },
      { label: "Request this plan", href: `/book-an-audit?plan=${plan.slug}#callback` },
    ],
    suggestions: [`Other ${plan.categoryLabel} plans`, "How does it work?"],
  };
}

function industryReply(slug: string, priceFocus: boolean): AssistantReply {
  const ind = industries.find((i) => i.slug === slug)!;
  const plans = auditPlans.filter((p) => p.category === slug);
  return {
    text:
      (priceFocus ? `${ind.title} plans and published ranges:\n` : `${ind.title}: ${ind.description}\n\nPlans:\n`) +
      plans.map(planLine).join("\n") +
      `\n\nPrices exclude 18% GST; expenses are reimbursed at actuals. The final quote is confirmed on a call.`,
    links: [
      { label: `${ind.shortTitle} audits`, href: `/industries/${ind.slug}` },
      { label: `${ind.shortTitle} plans & pricing`, href: `/audit-plans?category=${ind.slug}` },
    ],
    suggestions: ["Mystery vs SOP audit?", "Multi-location discount?", "Talk to a person"],
  };
}

function pricingOverview(): AssistantReply {
  const lines = planCategoryTabs.map((tab) => {
    const plans = auditPlans.filter((p) => p.category === tab.id);
    const min = Math.min(...plans.map((p) => p.priceMin));
    const max = Math.max(...plans.map((p) => p.priceMax));
    return `• ${tab.label}: ${formatPrice(min, max)}`;
  });
  return {
    text:
      `Published price ranges by industry (per audit, before 18% GST):\n${lines.join("\n")}\n\n` +
      `The range depends on the plan and format. Pick a plan to build an estimate with locations and add-ons — the final quote is confirmed on a call.`,
    links: [{ label: "Plans & pricing", href: "/audit-plans" }],
    suggestions: ["Hotel plans", "Restaurant plans", "Multi-location discount?"],
  };
}

function contactReply(lead = "You can reach the team directly:"): AssistantReply {
  return {
    text: `${lead}\n• WhatsApp: ${siteConfig.whatsapp}\n• Call: ${siteConfig.phone}\n• Email: ${siteConfig.email}\n• Office: ${siteConfig.address.full}\n\nWe reply within one working day.`,
    links: CONTACT_LINKS,
  };
}

/* ── FAQ retrieval ────────────────────────────────────────── */

const FAQS = [...generalFaqs, ...bookingFaqs, ...auditorFaqs, ...industries.flatMap((i) => i.faqs)];
const FAQ_INDEX = FAQS.map((f) => ({ faq: f, q: new Set(tokens(f.q)), a: new Set(tokens(f.a)) }));

function faqReply(q: string, threshold = 1.1): AssistantReply | undefined {
  const qt = tokens(q);
  if (!qt.length) return undefined;
  let best: (typeof FAQ_INDEX)[number] | undefined;
  let bestScore = 0;
  for (const entry of FAQ_INDEX) {
    let score = 0;
    for (const t of qt) score += entry.q.has(t) ? 2 : entry.a.has(t) ? 0.75 : 0;
    score /= Math.sqrt(qt.length + entry.q.size);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  // require a real overlap with the question wording, not a stray shared word
  if (!best || bestScore < threshold) return undefined;
  return { text: best.faq.a, suggestions: ["What does an audit cost?", "Talk to a person"] };
}

/* ── main entry ───────────────────────────────────────────── */

export function answer(raw: string): AssistantReply {
  const q = normalise(raw);
  if (!q) return GREETING;

  if (/^(hi|hii+|hello|hey|namaste|good (morning|afternoon|evening))\b/.test(q) && q.split(" ").length <= 4) {
    return GREETING;
  }
  if (has(q, "thank", "thanks", "thx")) {
    return { text: "You're welcome. Anything else you'd like to know?", suggestions: [...STARTER_QUESTIONS] };
  }

  // where the office is
  if (has(q, "address", "office", "located", "where are", "where is", "visit", "map", "direction", "borivali")) {
    return {
      text: `Our office: ${siteConfig.address.full}.`,
      links: [{ label: "Open in Google Maps", href: siteConfig.address.mapsHref }, ...CONTACT_LINKS.slice(0, 2)],
      suggestions: ["Talk to a person", "What does an audit cost?"],
    };
  }

  // a person, please
  if (has(q, "person", "human", "agent", "someone", "representative", "contact", "phone", "number", "whatsapp", "email", "call", "reach", "speak", "talk")) {
    return contactReply();
  }

  const plan = findPlan(q);
  const industry = findIndustry(q);
  const priceFocus = has(q, "price", "pricing", "cost", "fee", "charge", "rate", "quote", "budget", "expensive", "cheap", "₹", "rs", "inr", "much");

  if (plan) return planReply(plan);

  // a question that closely matches a published FAQ gets that exact answer
  const directFaq = faqReply(raw, 2);
  if (directFaq) return directFaq;

  // multi-location programmes and volume rates
  if (has(q, "multi", "multiple", "branch", "chain", "location", "outlet", "discount", "volume", "bulk", "program")) {
    return {
      text:
        "For brands with several locations, every unit is audited on one framework and rolled into one leadership report. " +
        "Volume rates apply automatically in the estimate: 3 or more locations save 5%, 5 or more save 10%.",
      links: [
        { label: "Design a program", href: "/book-an-audit?program=brand-standards#callback" },
        { label: "Plans & pricing", href: "/audit-plans" },
      ],
      suggestions: ["What does an audit cost?", "What is in the report?"],
    };
  }

  if (industry) return industryReply(industry.slug, priceFocus);
  if (priceFocus) return pricingOverview();

  // mystery vs revealed / SOP
  if (has(q, "mystery", "sop", "revealed", "difference", "format", "type", "unannounced", "announced")) {
    return {
      text:
        `Mystery audit — ${twoWays.mystery.sub.toLowerCase()}: ${twoWays.mystery.description}\n\n` +
        `Revealed / SOP audit — ${twoWays.sop.sub.toLowerCase()}: ${twoWays.sop.description}\n\n` +
        "Both use industry-specific checklists, evidence, scoring and management recommendations.",
      links: [
        { label: "Mystery audit plans", href: "/audit-plans?format=mystery" },
        { label: "SOP audit plans", href: "/audit-plans?format=sop" },
      ],
      suggestions: ["What does an audit cost?", "How does it work?"],
    };
  }

  // process
  if (has(q, "work", "process", "step", "method", "methodology", "procedure", "happen", "timeline", "long")) {
    return {
      text:
        "Every audit follows six steps:\n" +
        methodologySteps.map((s) => `${s.number} ${s.title} — ${s.description}`).join("\n"),
      links: [{ label: "How it works", href: "/how-it-works" }],
      suggestions: ["What is in the report?", "How do I book?"],
    };
  }

  // the deliverable
  if (has(q, "report", "deliverable", "scorecard", "score", "evidence", "output", "receive", "result")) {
    return {
      text: "Every audit closes with a structured report:\n" + reportDeliverables.map((d) => `• ${d.title} — ${d.detail}`).join("\n"),
      links: [{ label: "How it works", href: "/how-it-works" }],
      suggestions: ["What does an audit cost?", "How do I book?"],
    };
  }

  // joining the auditor network
  if (has(q, "auditor", "join", "job", "career", "apply", "hiring", "shopper", "earn", "freelance", "vacancy")) {
    const faq = faqReply(raw);
    return {
      text:
        faq?.text ??
        "We are building a city-by-city network of trained evaluators — hospitality, retail, healthcare and quality professionals. Apply online; selected profiles go through orientation and a sample assessment before paid assignments.",
      links: [{ label: "Join as auditor", href: "/join-as-auditor" }],
      suggestions: ["How does it work?", "Talk to a person"],
    };
  }

  // booking
  if (has(q, "book", "schedule", "start", "begin", "callback", "appointment", "order", "buy", "hire", "engage")) {
    return {
      text:
        "Pick a plan to build an estimate, then send the request — or just ask for a callback. We call within one working day to scope the audit and confirm the date. Nothing is charged online.",
      links: [
        { label: "Plans & pricing", href: "/audit-plans" },
        { label: "Request a callback", href: "/book-an-audit#callback" },
      ],
      suggestions: ["What does an audit cost?", "Talk to a person"],
    };
  }

  if (has(q, "industry", "industries", "sector", "serve", "cover")) {
    return {
      text: `We audit six industries: ${industries.map((i) => i.title).join(", ")}. Custom frameworks are available for others on request.`,
      links: [{ label: "All industries", href: "/industries" }],
      suggestions: ["Hotel plans", "Restaurant plans", "Hospital plans"],
    };
  }

  if (has(q, "who", "company", "about", "hospitalityminds", "based", "located", "office", "city")) {
    return {
      text: `${siteConfig.name} is the service audit practice of ${siteConfig.company}, based in ${siteConfig.baseCity} (${siteConfig.address.full}). ${siteConfig.description}`,
      links: [{ label: "About us", href: "/about" }],
      suggestions: ["How does it work?", "Talk to a person"],
    };
  }

  return (
    faqReply(raw) ?? {
      ...contactReply("I don't have a confident answer to that one, so I'd rather put you in touch with the team:"),
      suggestions: [...STARTER_QUESTIONS],
    }
  );
}
