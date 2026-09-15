import type { Industry } from "./industries";

export type AuditFormat = "mystery" | "sop";

export interface AuditPlan {
  slug: string;
  name: string;
  category: Industry["slug"];
  categoryLabel: string;
  format: AuditFormat;
  tagline: string;
  description: string;
  priceMin: number;
  priceMax: number;
  priceUnit: string;
  priceNote: string;
  scope: string[];
  deliverables: string[];
  whoItsFor: string[];
  journey: { phase: string; detail: string }[];
  evidenceCaptured: string[];
  bestFor: string;
  cta: string;
  /** Base price used by the price engine for checkout (₹) */
  basePrice: number;
  seo: {
    title: string;
    description: string;
  };
}

export const auditPlans: AuditPlan[] = [
  // ───────────────────────────── HOTELS ─────────────────────────────
  {
    slug: "hotel-mystery-lite",
    name: "Hotel Mystery Lite",
    category: "hotels-resorts",
    categoryLabel: "Hotels & Resorts",
    format: "mystery",
    tagline: "Focused check of one selected guest journey",
    description:
      "A tightly-scoped mystery audit of one selected leg of the guest journey — reservation test, arrival, or a selected room/service check — with scorecard, evidence and priority actions.",
    priceMin: 12000,
    priceMax: 18000,
    priceUnit: "audit",
    priceNote: "Final quotation varies with city, duration, complexity, reimbursement, travel and locations.",
    scope: [
      "Reservation / enquiry test",
      "Arrival & front desk",
      "Core service observations",
      "Selected room / common-area checks",
      "Scorecard + evidence",
      "Priority action summary"
    ],
    deliverables: [
      "Structured scorecard with section scores",
      "Evidence-backed findings",
      "Priority action summary (critical / high / medium / low)"
    ],
    whoItsFor: ["Individual properties", "First-time audit buyers", "Focused department checks"],
    journey: [
      { phase: "Scope selection", detail: "We agree which journey leg is audited" },
      { phase: "Auditor assignment", detail: "Hospitality-experienced auditor matched" },
      { phase: "The visit", detail: "Realistic journey, documented with timings" },
      { phase: "Report", detail: "Scorecard, evidence, priority actions" }
    ],
    evidenceCaptured: ["Timed observations", "Photographs where permitted", "Checkpoint-level scoring"],
    bestFor: "Single property, single journey focus",
    cta: "Book Mystery Lite",
    basePrice: 15000,
    seo: {
      title: "Hotel Mystery Lite Audit Plan",
      description: "Focused mystery audit of one selected hotel guest journey — ₹12K–18K per audit with scorecard, evidence and priority actions."
    }
  },
  {
    slug: "hotel-mystery-360",
    name: "Hotel Mystery 360",
    category: "hotels-resorts",
    categoryLabel: "Hotels & Resorts",
    format: "mystery",
    tagline: "Complete overnight guest-experience audit",
    description:
      "The full arc — booking to checkout — as an overnight guest. Every department, every touchpoint, with a detailed scorecard and management debrief.",
    priceMin: 25000,
    priceMax: 45000,
    priceUnit: "audit + stay",
    priceNote: "Stay and expenses reimbursed separately at actuals or agreed cap.",
    scope: [
      "Booking journey",
      "Arrival / check-in",
      "Room & housekeeping",
      "F&B experience",
      "Service recovery test",
      "Upselling & staff behavior",
      "Checkout",
      "Detailed scorecard + debrief"
    ],
    deliverables: [
      "Detailed multi-section scorecard",
      "Evidence pack — timings and photographs where permitted",
      "Service recovery test results",
      "Management debrief"
    ],
    whoItsFor: ["Full-service hotels", "Resorts", "Properties preparing for brand review"],
    journey: [
      { phase: "Scoping", detail: "Full guest journey mapped to checkpoints" },
      { phase: "Auditor assignment", detail: "Senior hospitality auditor matched" },
      { phase: "The stay", detail: "Overnight journey, every touchpoint documented" },
      { phase: "Verification", detail: "Internal quality review" },
      { phase: "Debrief", detail: "Findings and actions with your team" }
    ],
    evidenceCaptured: ["Full-journey timings", "Photographs where permitted", "Recovery-test documentation", "Department-level scoring"],
    bestFor: "Complete experience truth",
    cta: "Book Mystery 360",
    basePrice: 35000,
    seo: {
      title: "Hotel Mystery 360 Audit Plan",
      description: "Complete overnight hotel guest-experience audit — ₹25K–45K per audit including booking, arrival, room, F&B, recovery test and checkout."
    }
  },
  {
    slug: "hotel-sop-audit",
    name: "Hotel SOP Audit",
    category: "hotels-resorts",
    categoryLabel: "Hotels & Resorts",
    format: "sop",
    tagline: "Revealed audit for operations and management",
    description:
      "An announced, in-depth audit of department SOPs, systems, documentation and management controls — front office to F&B — with a corrective-action roadmap.",
    priceMin: 35000,
    priceMax: 75000,
    priceUnit: "audit",
    priceNote: "Scope scales with property size and departments covered.",
    scope: [
      "Department SOP checks",
      "Front office",
      "Housekeeping",
      "F&B service",
      "Guest-service systems",
      "Documentation review",
      "HOD interactions",
      "Corrective-action roadmap"
    ],
    deliverables: [
      "Department-wise SOP compliance report",
      "Documentation review findings",
      "Training-gap identification",
      "Corrective-action roadmap with priorities"
    ],
    whoItsFor: ["Operations leadership", "Pre-opening and brand reviews", "Group properties"],
    journey: [
      { phase: "SOP mapping", detail: "Your SOPs mapped to audit framework" },
      { phase: "Announced visit", detail: "Department walkthroughs and HOD interactions" },
      { phase: "Documentation review", detail: "Records, logs and systems checked" },
      { phase: "Report & roadmap", detail: "Compliance report and corrective plan" }
    ],
    evidenceCaptured: ["SOP compliance scores", "Documentation evidence", "HOD interview notes", "Physical standards inspection"],
    bestFor: "Operations depth and management control",
    cta: "Book SOP Audit",
    basePrice: 55000,
    seo: {
      title: "Hotel SOP Audit Plan",
      description: "Revealed hotel SOP audit — ₹35K–75K+ covering department SOPs, documentation, HOD interactions and a corrective-action roadmap."
    }
  },
  // ─────────────────────────── RESTAURANTS ───────────────────────────
  {
    slug: "mystery-diner",
    name: "Mystery Diner",
    category: "restaurants-cafes",
    categoryLabel: "Restaurants & Cafés",
    format: "mystery",
    tagline: "One complete dining journey",
    description:
      "A full dining journey — reservation call to farewell — audited as a normal guest. Service timing, menu knowledge, upselling and billing, scored.",
    priceMin: 7000,
    priceMax: 12000,
    priceUnit: "outlet",
    priceNote: "Meal expenses reimbursed separately at actuals.",
    scope: [
      "Reservation / call",
      "Greeting & seating",
      "Menu knowledge",
      "Service timing",
      "Upselling",
      "Food presentation",
      "Billing & farewell"
    ],
    deliverables: ["Service-journey scorecard", "Timed observations", "Priority recommendations"],
    whoItsFor: ["Standalone outlets", "QSR and café chains", "New outlet stabilisation"],
    journey: [
      { phase: "Scoping", detail: "Journey and standards mapped" },
      { phase: "The visit", detail: "Complete dining journey as a guest" },
      { phase: "Report", detail: "Scorecard and recommendations" }
    ],
    evidenceCaptured: ["Stage-wise timings", "Photographs where permitted", "Upsell observations"],
    bestFor: "Fast, focused outlet truth",
    cta: "Book Mystery Diner",
    basePrice: 9500,
    seo: {
      title: "Mystery Diner Audit Plan",
      description: "Complete restaurant mystery dining audit — ₹7K–12K per outlet covering reservation, greeting, service timing, upselling and billing."
    }
  },
  {
    slug: "restaurant-360",
    name: "Restaurant 360",
    category: "restaurants-cafes",
    categoryLabel: "Restaurants & Cafés",
    format: "mystery",
    tagline: "Customer experience + operational observations",
    description:
      "Mystery dining plus phone/online enquiry testing, hygiene observations and competitor-style scoring — with a management debrief.",
    priceMin: 15000,
    priceMax: 25000,
    priceUnit: "outlet",
    priceNote: "Expenses reimbursed separately at actuals.",
    scope: [
      "Mystery dining",
      "Phone / online enquiry",
      "Hygiene observations",
      "Service standards",
      "Upsell / conversion",
      "Competitor-style scoring",
      "Management debrief"
    ],
    deliverables: ["360° scorecard", "Enquiry test results", "Hygiene observations", "Management debrief"],
    whoItsFor: ["Multi-outlet brands", "Serious experience improvement", "Investor / brand reviews"],
    journey: [
      { phase: "Scoping", detail: "Full experience map" },
      { phase: "Enquiry testing", detail: "Phone and online journeys tested" },
      { phase: "The dining visit", detail: "Complete journey with hygiene observations" },
      { phase: "Debrief", detail: "Findings and actions with management" }
    ],
    evidenceCaptured: ["Dining timings", "Enquiry transcripts/notes", "Hygiene observations", "Photographs where permitted"],
    bestFor: "Multi-dimension outlet intelligence",
    cta: "Book Restaurant 360",
    basePrice: 20000,
    seo: {
      title: "Restaurant 360 Audit Plan",
      description: "Restaurant 360 audit — ₹15K–25K per outlet combining mystery dining, enquiry testing, hygiene observation and management debrief."
    }
  },
  {
    slug: "restaurant-sop-audit",
    name: "Restaurant SOP Audit",
    category: "restaurants-cafes",
    categoryLabel: "Restaurants & Cafés",
    format: "sop",
    tagline: "Revealed service and standards audit",
    description:
      "An announced audit of opening readiness, service SOPs, guest handling, cleanliness, billing controls and complaint handling — with a corrective plan.",
    priceMin: 20000,
    priceMax: 40000,
    priceUnit: "outlet",
    priceNote: "Scope scales with outlet size and coverage.",
    scope: [
      "Opening readiness",
      "Service SOP",
      "Guest handling",
      "Cleanliness",
      "Billing controls",
      "Complaint handling",
      "Training gaps",
      "Corrective plan"
    ],
    deliverables: ["SOP compliance report", "Training-gap analysis", "Corrective-action plan"],
    whoItsFor: ["Chain operations teams", "Franchise governance", "Pre-launch readiness"],
    journey: [
      { phase: "SOP mapping", detail: "Your SOPs mapped to framework" },
      { phase: "Announced visit", detail: "Operations walkthrough and staff interactions" },
      { phase: "Review", detail: "Documentation and controls checked" },
      { phase: "Report", detail: "Compliance report and corrective plan" }
    ],
    evidenceCaptured: ["SOP compliance scores", "Opening-readiness checklist", "Staff interaction notes"],
    bestFor: "Operational control and governance",
    cta: "Book SOP Audit",
    basePrice: 30000,
    seo: {
      title: "Restaurant SOP Audit Plan",
      description: "Revealed restaurant SOP audit — ₹20K–40K+ per outlet covering service SOPs, guest handling, billing controls and corrective planning."
    }
  },
  // ─────────────────────────── HOSPITALS ────────────────────────────
  {
    slug: "patient-journey-audit",
    name: "Patient Journey Audit",
    category: "hospitals-clinics",
    categoryLabel: "Hospitals & Clinics",
    format: "mystery",
    tagline: "Mystery patient-facing service check",
    description:
      "A mystery patient journey — appointment call to billing — covering reception, waiting experience, communication and wayfinding, with a service scorecard.",
    priceMin: 12000,
    priceMax: 20000,
    priceUnit: "journey",
    priceNote: "Non-clinical service scope only.",
    scope: [
      "Call / appointment",
      "Reception",
      "Waiting experience",
      "Staff communication",
      "Wayfinding",
      "Billing experience",
      "Service scorecard"
    ],
    deliverables: ["Patient-journey scorecard", "Service observations", "Priority recommendations"],
    whoItsFor: ["Single-specialty clinics", "Hospital OPD services", "Patient-experience teams"],
    journey: [
      { phase: "Journey mapping", detail: "Patient service journey scoped" },
      { phase: "The visit", detail: "Realistic patient-facing journey" },
      { phase: "Report", detail: "Scorecard and recommendations" }
    ],
    evidenceCaptured: ["Timed observations", "Queue measurements", "Communication scoring"],
    bestFor: "First look at patient experience",
    cta: "Book Patient Journey",
    basePrice: 16000,
    seo: {
      title: "Patient Journey Audit Plan",
      description: "Mystery patient journey audit — ₹12K–20K per journey covering appointment handling, reception, waiting experience and communication."
    }
  },
  {
    slug: "hospital-experience-360",
    name: "Hospital Experience 360",
    category: "hospitals-clinics",
    categoryLabel: "Hospitals & Clinics",
    format: "mystery",
    tagline: "Multi-touchpoint service quality program",
    description:
      "A multi-touchpoint audit of patient-facing service — phone, front desk, assistance, waiting, escalation — closing with an executive debrief.",
    priceMin: 25000,
    priceMax: 50000,
    priceUnit: "facility",
    priceNote: "Scope scales with facility size and departments.",
    scope: [
      "Phone journey",
      "Front desk",
      "Patient assistance",
      "Waiting & communication",
      "Facility service experience",
      "Escalation handling",
      "Executive debrief"
    ],
    deliverables: ["Multi-touchpoint scorecard", "Escalation handling review", "Executive debrief"],
    whoItsFor: ["Multi-specialty hospitals", "Growing clinic chains", "Patient-experience leadership"],
    journey: [
      { phase: "Scoping", detail: "Touchpoints and standards mapped" },
      { phase: "Multi-touchpoint visits", detail: "Phone, front desk and facility journeys" },
      { phase: "Verification", detail: "Internal quality review" },
      { phase: "Executive debrief", detail: "Leadership session on findings" }
    ],
    evidenceCaptured: ["Touchpoint timings", "Escalation scenarios", "Photographs where permitted"],
    bestFor: "Full patient-experience picture",
    cta: "Book Experience 360",
    basePrice: 37500,
    seo: {
      title: "Hospital Experience 360 Audit Plan",
      description: "Hospital experience 360 audit — ₹25K–50K per facility covering phone, front desk, patient assistance, waiting and escalation handling."
    }
  },
  {
    slug: "hospital-service-sop-audit",
    name: "Service SOP Audit",
    category: "hospitals-clinics",
    categoryLabel: "Hospitals & Clinics",
    format: "sop",
    tagline: "Revealed non-clinical service audit",
    description:
      "An announced audit of patient-service SOPs, front-desk systems, communication standards and facility services — with a corrective plan.",
    priceMin: 40000,
    priceMax: 90000,
    priceUnit: "facility",
    priceNote: "Clinical audits require separately qualified specialists — out of scope.",
    scope: [
      "Patient-service SOPs",
      "Front desk systems",
      "Communication standards",
      "Facility-service checks",
      "Documentation",
      "Training gaps",
      "Corrective plan"
    ],
    deliverables: ["Service SOP compliance report", "Documentation findings", "Training-gap analysis", "Corrective plan"],
    whoItsFor: ["Hospital operations", "Quality teams", "Pre-accreditation service readiness"],
    journey: [
      { phase: "SOP mapping", detail: "Service SOPs mapped to framework" },
      { phase: "Announced visit", detail: "Department walkthroughs and interactions" },
      { phase: "Review", detail: "Documentation and systems checked" },
      { phase: "Report", detail: "Compliance report and corrective plan" }
    ],
    evidenceCaptured: ["SOP compliance scores", "Documentation evidence", "Interaction notes"],
    bestFor: "Service systems and control",
    cta: "Book SOP Audit",
    basePrice: 65000,
    seo: {
      title: "Hospital Service SOP Audit Plan",
      description: "Revealed hospital service SOP audit — ₹40K–90K+ covering front-desk systems, communication standards, documentation and corrective planning."
    }
  },
  // ─────────────────────────── MALLS / RETAIL ───────────────────────
  {
    slug: "mall-mystery-visit",
    name: "Mall Mystery Visit",
    category: "malls-retail",
    categoryLabel: "Malls & Retail",
    format: "mystery",
    tagline: "Visitor experience across selected touchpoints",
    description:
      "A mystery visitor journey across selected touchpoints — entry, parking, helpdesk, signage, washrooms and housekeeping — scored on visitor standards.",
    priceMin: 12000,
    priceMax: 20000,
    priceUnit: "location",
    priceNote: "Touchpoint selection scoped with mall management.",
    scope: [
      "Entry & security",
      "Parking",
      "Helpdesk",
      "Signage",
      "Washrooms",
      "Housekeeping",
      "Visitor support"
    ],
    deliverables: ["Visitor-journey scorecard", "Zone observations", "Priority recommendations"],
    whoItsFor: ["Single properties", "First-time mall audits", "Focused zone checks"],
    journey: [
      { phase: "Touchpoint scoping", detail: "Zones and standards agreed" },
      { phase: "The visit", detail: "Visitor journey across touchpoints" },
      { phase: "Report", detail: "Scorecard and recommendations" }
    ],
    evidenceCaptured: ["Zone timings", "Photographs where permitted", "Assistance observations"],
    bestFor: "Visitor-experience snapshot",
    cta: "Book Mystery Visit",
    basePrice: 16000,
    seo: {
      title: "Mall Mystery Visit Audit Plan",
      description: "Mall mystery visit audit — ₹12K–20K per location covering entry, parking, helpdesk, signage, washrooms and housekeeping standards."
    }
  },
  {
    slug: "mall-experience-360",
    name: "Mall Experience 360",
    category: "malls-retail",
    categoryLabel: "Malls & Retail",
    format: "mystery",
    tagline: "Complete visitor standards review",
    description:
      "The complete visitor journey — multiple service points, retail interaction samples, food-court observations and safety-service checks — with debrief.",
    priceMin: 25000,
    priceMax: 45000,
    priceUnit: "location",
    priceNote: "Scope scales with property size.",
    scope: [
      "Full mystery journey",
      "Multiple service points",
      "Retail interaction samples",
      "Food-court observations",
      "Safety-service observations",
      "Evidence + scoring",
      "Management debrief"
    ],
    deliverables: ["Complete scorecard", "Retail interaction samples", "Safety-service observations", "Management debrief"],
    whoItsFor: ["Large malls", "Multi-zone properties", "Brand-compliance reviews"],
    journey: [
      { phase: "Scoping", detail: "Full property map agreed" },
      { phase: "The journey", detail: "Complete visitor journey with samples" },
      { phase: "Verification", detail: "Internal quality review" },
      { phase: "Debrief", detail: "Findings and actions with management" }
    ],
    evidenceCaptured: ["Multi-zone timings", "Retail interaction notes", "Photographs where permitted"],
    bestFor: "Complete property intelligence",
    cta: "Book Experience 360",
    basePrice: 35000,
    seo: {
      title: "Mall Experience 360 Audit Plan",
      description: "Mall experience 360 audit — ₹25K–45K per location covering the full visitor journey, retail interactions, food court and safety observations."
    }
  },
  {
    slug: "mall-sop-audit",
    name: "Mall SOP Audit",
    category: "malls-retail",
    categoryLabel: "Malls & Retail",
    format: "sop",
    tagline: "Revealed service and facility-standard audit",
    description:
      "An announced audit of security, helpdesk, housekeeping, parking and signage SOPs — documentation review and corrective actions included.",
    priceMin: 40000,
    priceMax: 80000,
    priceUnit: "location",
    priceNote: "Scope scales with services covered.",
    scope: [
      "Security service SOP",
      "Helpdesk",
      "Housekeeping",
      "Parking service",
      "Signage standards",
      "Documentation",
      "Corrective actions"
    ],
    deliverables: ["Facility SOP compliance report", "Documentation findings", "Corrective-action plan"],
    whoItsFor: ["Mall operations", "Facility management teams", "Property governance"],
    journey: [
      { phase: "SOP mapping", detail: "Service SOPs mapped to framework" },
      { phase: "Announced visit", detail: "Zone walkthroughs and staff interactions" },
      { phase: "Review", detail: "Documentation and records checked" },
      { phase: "Report", detail: "Compliance report and corrective plan" }
    ],
    evidenceCaptured: ["SOP compliance scores", "Documentation evidence", "Zone inspection notes"],
    bestFor: "Facility standards and control",
    cta: "Book SOP Audit",
    basePrice: 60000,
    seo: {
      title: "Mall SOP Audit Plan",
      description: "Revealed mall SOP audit — ₹40K–80K+ per location covering security, helpdesk, housekeeping, parking service and signage standards."
    }
  },
  // ─────────────────────────── CINEMAS ──────────────────────────────
  {
    slug: "mystery-movie",
    name: "Mystery Movie",
    category: "cinemas",
    categoryLabel: "Cinemas & Multiplexes",
    format: "mystery",
    tagline: "One complete cinema visit",
    description:
      "A complete movie visit — booking, entry, ticketing, F&B, auditorium readiness and washrooms — audited as a normal moviegoer.",
    priceMin: 6000,
    priceMax: 10000,
    priceUnit: "audit",
    priceNote: "Ticket and F&B expenses reimbursed separately at actuals.",
    scope: [
      "Booking",
      "Entry",
      "Ticketing",
      "F&B",
      "Upselling",
      "Auditorium readiness",
      "Washroom / cleanliness"
    ],
    deliverables: ["Visit scorecard", "Timed observations", "Priority recommendations"],
    whoItsFor: ["Single screens", "Multiplex properties", "Peak-show checks"],
    journey: [
      { phase: "Scoping", detail: "Visit journey and show timing agreed" },
      { phase: "The visit", detail: "Complete movie visit as a guest" },
      { phase: "Report", detail: "Scorecard and recommendations" }
    ],
    evidenceCaptured: ["Queue timings", "Auditorium checks", "Photographs where permitted"],
    bestFor: "Fast visit truth",
    cta: "Book Mystery Movie",
    basePrice: 8000,
    seo: {
      title: "Mystery Movie Audit Plan",
      description: "Cinema mystery audit — ₹6K–10K per audit covering booking, ticketing queues, F&B service, auditorium readiness and washroom cleanliness."
    }
  },
  {
    slug: "cinema-360",
    name: "Cinema 360",
    category: "cinemas",
    categoryLabel: "Cinemas & Multiplexes",
    format: "mystery",
    tagline: "Deep customer-experience review",
    description:
      "Online + onsite journeys, queue timing, staff behaviour, F&B conversion and auditorium experience — with evidence and debrief.",
    priceMin: 12000,
    priceMax: 20000,
    priceUnit: "location",
    priceNote: "Expenses reimbursed separately at actuals.",
    scope: [
      "Online + onsite journey",
      "Queue timing",
      "Staff behavior",
      "F&B conversion",
      "Auditorium experience",
      "Cleanliness",
      "Evidence + debrief"
    ],
    deliverables: ["360° scorecard", "Queue timing data", "F&B conversion observations", "Management debrief"],
    whoItsFor: ["Multiplex chains", "Experience improvement programs", "Brand reviews"],
    journey: [
      { phase: "Scoping", detail: "Full journey map agreed" },
      { phase: "Online + onsite", detail: "Both journeys audited" },
      { phase: "Verification", detail: "Internal quality review" },
      { phase: "Debrief", detail: "Findings and actions with management" }
    ],
    evidenceCaptured: ["Dual-journey timings", "Staff behaviour notes", "Conversion observations"],
    bestFor: "Full experience intelligence",
    cta: "Book Cinema 360",
    basePrice: 16000,
    seo: {
      title: "Cinema 360 Audit Plan",
      description: "Cinema 360 audit — ₹12K–20K per location covering online and onsite journeys, queue timing, staff behaviour and F&B conversion."
    }
  },
  {
    slug: "cinema-sop-audit",
    name: "Cinema SOP Audit",
    category: "cinemas",
    categoryLabel: "Cinemas & Multiplexes",
    format: "sop",
    tagline: "Revealed operational service audit",
    description:
      "An announced audit of opening readiness, ticketing and F&B SOPs, guest handling and cleanliness standards — with a corrective plan.",
    priceMin: 20000,
    priceMax: 40000,
    priceUnit: "location",
    priceNote: "Scope scales with property size.",
    scope: [
      "Opening readiness",
      "Ticketing SOP",
      "F&B SOP",
      "Guest handling",
      "Cleanliness standards",
      "Complaint handling",
      "Corrective plan"
    ],
    deliverables: ["Operational SOP compliance report", "Training-gap analysis", "Corrective-action plan"],
    whoItsFor: ["Multiplex operations", "Chain governance", "Pre-launch readiness"],
    journey: [
      { phase: "SOP mapping", detail: "Operational SOPs mapped" },
      { phase: "Announced visit", detail: "Operations walkthrough and interactions" },
      { phase: "Review", detail: "Controls and records checked" },
      { phase: "Report", detail: "Compliance report and corrective plan" }
    ],
    evidenceCaptured: ["SOP compliance scores", "Opening readiness checks", "Interaction notes"],
    bestFor: "Operational control",
    cta: "Book SOP Audit",
    basePrice: 30000,
    seo: {
      title: "Cinema SOP Audit Plan",
      description: "Revealed cinema SOP audit — ₹20K–40K+ per location covering ticketing, F&B SOPs, guest handling and cleanliness standards."
    }
  },
  // ─────────────────────────── SALONS / SPAS ────────────────────────
  {
    slug: "mystery-salon-visit",
    name: "Mystery Salon Visit",
    category: "salons-spas",
    categoryLabel: "Salons & Spas",
    format: "mystery",
    tagline: "Single customer journey",
    description:
      "A complete salon journey — booking to billing — including consultation, hygiene and service behaviour, audited discreetly as a normal client.",
    priceMin: 6000,
    priceMax: 10000,
    priceUnit: "visit",
    priceNote: "Service cost reimbursed separately at actuals.",
    scope: [
      "Booking",
      "Greeting",
      "Consultation",
      "Hygiene",
      "Service behavior",
      "Upselling",
      "Billing / rebooking"
    ],
    deliverables: ["Client-journey scorecard", "Hygiene observations", "Priority recommendations"],
    whoItsFor: ["Standalone salons", "Spa properties", "Focused service checks"],
    journey: [
      { phase: "Scoping", detail: "Service journey agreed" },
      { phase: "The visit", detail: "Realistic client journey" },
      { phase: "Report", detail: "Scorecard and recommendations" }
    ],
    evidenceCaptured: ["Journey timings", "Hygiene observations", "Consultation notes"],
    bestFor: "Fast, discreet truth",
    cta: "Book Mystery Visit",
    basePrice: 8000,
    seo: {
      title: "Mystery Salon Visit Audit Plan",
      description: "Salon mystery visit audit — ₹6K–10K per visit covering booking, consultation, hygiene, service behaviour and rebooking."
    }
  },
  {
    slug: "salon-experience-360",
    name: "Salon Experience 360",
    category: "salons-spas",
    categoryLabel: "Salons & Spas",
    format: "mystery",
    tagline: "Deep service-quality audit",
    description:
      "Mystery service plus phone/WhatsApp enquiry testing, consultation quality, privacy and hygiene standards — with a management debrief.",
    priceMin: 12000,
    priceMax: 22000,
    priceUnit: "location",
    priceNote: "Service costs reimbursed separately at actuals.",
    scope: [
      "Mystery service",
      "Phone / WhatsApp enquiry",
      "Consultation quality",
      "Privacy & hygiene",
      "Retail upselling",
      "Rebooking",
      "Management debrief"
    ],
    deliverables: ["360° scorecard", "Enquiry test results", "Privacy & hygiene review", "Management debrief"],
    whoItsFor: ["Salon chains", "Premium spas", "Experience programs"],
    journey: [
      { phase: "Scoping", detail: "Full journey and standards agreed" },
      { phase: "Enquiry testing", detail: "Phone / WhatsApp journeys tested" },
      { phase: "The visit", detail: "Complete service journey" },
      { phase: "Debrief", detail: "Findings and actions with management" }
    ],
    evidenceCaptured: ["Service timings", "Enquiry notes", "Hygiene observations"],
    bestFor: "Multi-dimension service intelligence",
    cta: "Book Experience 360",
    basePrice: 17000,
    seo: {
      title: "Salon Experience 360 Audit Plan",
      description: "Salon experience 360 audit — ₹12K–22K per location covering mystery service, enquiry testing, consultation quality and rebooking."
    }
  },
  {
    slug: "salon-sop-audit",
    name: "Salon SOP Audit",
    category: "salons-spas",
    categoryLabel: "Salons & Spas",
    format: "sop",
    tagline: "Revealed standards & process audit",
    description:
      "An announced audit of service SOPs, hygiene controls, product handling and sales standards — with a corrective plan.",
    priceMin: 18000,
    priceMax: 35000,
    priceUnit: "location",
    priceNote: "Scope scales with outlet size.",
    scope: [
      "Opening readiness",
      "Service SOPs",
      "Hygiene controls",
      "Product handling",
      "Customer-service process",
      "Sales / rebooking standards",
      "Corrective plan"
    ],
    deliverables: ["SOP compliance report", "Hygiene control findings", "Corrective-action plan"],
    whoItsFor: ["Chain operations", "Franchise governance", "Brand reviews"],
    journey: [
      { phase: "SOP mapping", detail: "Service SOPs mapped to framework" },
      { phase: "Announced visit", detail: "Standards walkthrough and interactions" },
      { phase: "Review", detail: "Controls and records checked" },
      { phase: "Report", detail: "Compliance report and corrective plan" }
    ],
    evidenceCaptured: ["SOP compliance scores", "Hygiene control checks", "Interaction notes"],
    bestFor: "Standards and governance",
    cta: "Book SOP Audit",
    basePrice: 26000,
    seo: {
      title: "Salon SOP Audit Plan",
      description: "Revealed salon SOP audit — ₹18K–35K+ per location covering service SOPs, hygiene controls, product handling and rebooking standards."
    }
  }
];

export function getPlanBySlug(slug: string): AuditPlan | undefined {
  return auditPlans.find((p) => p.slug === slug);
}

export function getPlansByCategory(category: string): AuditPlan[] {
  return auditPlans.filter((p) => p.category === category);
}

export function formatPrice(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `₹${Math.round(n / 1000)}K` : `₹${n}`;
  return `${fmt(min)}–${fmt(max)}`;
}

export const addOns = [
  {
    id: "additional-location",
    label: "Additional Location",
    description: "Audit an additional property/outlet within the same program",
    price: 12000
  },
  {
    id: "priority-audit",
    label: "Priority Audit",
    description: "Compressed scheduling with priority auditor assignment",
    price: 4000
  },
  {
    id: "management-debrief",
    label: "Management Debrief",
    description: "Extended live debrief session with leadership",
    price: 6000
  },
  {
    id: "evidence-review",
    label: "Additional Evidence Review",
    description: "Extended evidence pack and documentation review",
    price: 3500
  }
] as const;

export const planCategoryTabs = [
  { id: "hotels-resorts", label: "Hotels" },
  { id: "restaurants-cafes", label: "Restaurants" },
  { id: "hospitals-clinics", label: "Hospitals" },
  { id: "malls-retail", label: "Malls / Retail" },
  { id: "cinemas", label: "Cinemas" },
  { id: "salons-spas", label: "Salons / Spas" }
] as const;
