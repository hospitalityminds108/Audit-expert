export interface Industry {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  auditTypes: string[];
  image: string;
  imageAlt: string;
  /** Long-form industry page content */
  heroEyebrow: string;
  heroHeadline: string;
  heroSupport: string;
  problem: { heading: string; body: string[] };
  journey: { title: string; caption: string }[];
  whatWeInspect: string[];
  evidenceApproach: string[];
  auditProcess: { step: string; detail: string }[];
  scorecardExample: { section: string; score: number }[];
  recommendedPlanSlugs: string[];
  faqs: { q: string; a: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const industries: Industry[] = [
  {
    slug: "hotels-resorts",
    number: "01",
    title: "Hotels & Resorts",
    shortTitle: "Hotels",
    description:
      "Guest journey, reservations, arrival, rooms, housekeeping, F&B, service, checkout and brand standards.",
    auditTypes: ["Mystery Stay", "Front Office", "Housekeeping", "F&B", "Reservation Call", "Banquet", "SOP Audit"],
    image: "/images/industries/hotels-resorts.jpg",
    imageAlt: "Elegant luxury hotel lobby with warm lighting",
    heroEyebrow: "HOTELS & RESORTS",
    heroHeadline: "THE GUEST JOURNEY IS YOUR BRAND.",
    heroSupport:
      "From reservation call to checkout, every touchpoint decides whether a guest returns. We audit the full journey — or any single leg of it — with evidence and scoring.",
    problem: {
      heading: "Five-star standards don't survive on brochures.",
      body: [
        "A hotel can invest in training, interiors and systems and still lose the guest at the front desk, in the queue at breakfast, or on a call that went unanswered. Management sees occupancy, reviews and complaints — but rarely sees the actual experience as it happens.",
        "Between SOP binders and guest reviews sits the truth: what actually gets delivered, shift by shift, department by department. That gap is where reputations quietly erode."
      ]
    },
    journey: [
      { title: "Reservation & Enquiry", caption: "Response time, accuracy, upselling, tone" },
      { title: "Arrival & Check-in", caption: "Greeting, queue, efficiency, welcome standards" },
      { title: "Room & Housekeeping", caption: "Room readiness, cleanliness, amenities, servicing" },
      { title: "Dining & Room Service", caption: "Menu knowledge, timing, service, presentation" },
      { title: "Service Recovery", caption: "How complaints are handled and recovered" },
      { title: "Checkout & Farewell", caption: "Billing accuracy, speed, farewell standards" }
    ],
    whatWeInspect: [
      "Reservation call handling — response time, accuracy and upselling",
      "Arrival, kerbside and check-in experience",
      "Room readiness, housekeeping standards and servicing quality",
      "F&B service — breakfast, in-room dining, restaurant and bar",
      "Guest-facing grooming, courtesy and language standards",
      "Brand-standard compliance across public areas",
      "Service recovery and complaint handling",
      "Checkout, billing accuracy and farewell"
    ],
    evidenceApproach: [
      "Time-stamped observations at every touchpoint",
      "Photographic evidence where permitted by assignment and venue rules",
      "Service timings recorded against brand benchmarks",
      "Structured scores, not anecdotes — every finding tied to a checkpoint"
    ],
    auditProcess: [
      { step: "Scope the property", detail: "We map your guest journey and brand standards into checkpoints" },
      { step: "Match the auditor", detail: "A hospitality-experienced auditor fits the property profile" },
      { step: "The visit", detail: "A realistic guest journey, observed and documented" },
      { step: "Verification", detail: "Internal quality review of evidence and report" },
      { step: "Debrief", detail: "Findings, scores and corrective actions with your team" }
    ],
    scorecardExample: [
      { section: "Reservation & Pre-arrival", score: 91 },
      { section: "Arrival & Front Office", score: 88 },
      { section: "Room & Housekeeping", score: 94 },
      { section: "F&B Service", score: 86 },
      { section: "Service Recovery", score: 82 },
      { section: "Checkout & Farewell", score: 93 }
    ],
    recommendedPlanSlugs: ["hotel-mystery-lite", "hotel-mystery-360", "hotel-sop-audit"],
    faqs: [
      {
        q: "Will my staff know when the audit happens?",
        a: "Normally no. A mystery stay is designed to reflect a realistic guest experience. Rules and ethical boundaries are agreed with you before deployment."
      },
      {
        q: "Does the audit price include the room and meals?",
        a: "Unless expressly stated, travel, stay, meals and service purchases are reimbursed separately at actuals or under an agreed cap."
      },
      {
        q: "Can you audit just one department?",
        a: "Yes. Focused journeys — front office only, housekeeping only, F&B only — are available as scoped audits."
      }
    ],
    seo: {
      title: "Hotel Mystery Audit & SOP Audit Services",
      description:
        "Hotel mystery audit and revealed SOP audit services for hotels and resorts — reservations, front office, housekeeping, F&B and brand standards with evidence-backed scorecards.",
      keywords: ["hotel mystery audit", "hotel service audit", "hotel SOP audit", "hotel guest experience audit", "resort audit"]
    }
  },
  {
    slug: "restaurants-cafes",
    number: "02",
    title: "Restaurants & Cafés",
    shortTitle: "Restaurants",
    description:
      "Reservation, greeting, service, menu knowledge, speed, hygiene, upselling, billing and overall dining experience.",
    auditTypes: ["Mystery Diner", "Delivery Check", "Hygiene", "Service SOP", "Upselling", "Brand Standards"],
    image: "/images/industries/restaurants-cafes.jpg",
    imageAlt: "Fine dining restaurant with attentive service",
    heroEyebrow: "RESTAURANTS & CAFÉS",
    heroHeadline: "EVERY TABLE IS A REVIEW WAITING TO HAPPEN.",
    heroSupport:
      "Diners decide in the first four minutes. We audit the complete dining journey — reservation to billing — and show you exactly where the experience wins or breaks.",
    problem: {
      heading: "The food is right. The experience isn't always.",
      body: [
        "Reviews rarely say 'the SOP for greeting was not followed'. They say 'nobody acknowledged us', 'we waited 20 minutes for the menu', 'the server didn't know the dish'. Operationally small gaps, publicly expensive.",
        "Owners can't sit at every table, every shift, across every outlet. The experience drifts — quietly, and usually at the moments guests remember most."
      ]
    },
    journey: [
      { title: "Reservation / Walk-in", caption: "Call handling, wait acknowledgment, seating" },
      { title: "Greeting & Seating", caption: "Welcome standards, table offer, first approach" },
      { title: "Menu & Order", caption: "Menu knowledge, recommendations, upselling" },
      { title: "Service Timing", caption: "Order-to-serve, check-backs, attentiveness" },
      { title: "Food & Presentation", caption: "Presentation, temperature, accuracy" },
      { title: "Billing & Farewell", caption: "Bill accuracy, payment ease, invitation to return" }
    ],
    whatWeInspect: [
      "Reservation and enquiry call handling",
      "Greeting, seating and first-approach timing",
      "Menu knowledge, recommendation and upselling quality",
      "Order accuracy, service speed and check-back rhythm",
      "Food presentation and temperature at the table",
      "Hygiene observations — visible areas, staff practices",
      "Billing accuracy and farewell standards",
      "Brand-standard compliance across the outlet"
    ],
    evidenceApproach: [
      "Timed service measurements at every stage",
      "Photographic evidence where permitted",
      "Observed staff behaviour tied to specific checkpoints",
      "Structured scores per service stage"
    ],
    auditProcess: [
      { step: "Scope the outlet", detail: "We map your service journey and standards into checkpoints" },
      { step: "Match the auditor", detail: "An F&B-experienced auditor dines as a normal guest" },
      { step: "The visit", detail: "A complete dining journey, observed and documented" },
      { step: "Verification", detail: "Internal quality review of evidence and report" },
      { step: "Debrief", detail: "Findings, scores and corrective actions with management" }
    ],
    scorecardExample: [
      { section: "Reservation & Welcome", score: 89 },
      { section: "Seating & First Approach", score: 92 },
      { section: "Menu Knowledge & Upselling", score: 84 },
      { section: "Service Timing", score: 87 },
      { section: "Food Presentation", score: 95 },
      { section: "Billing & Farewell", score: 90 }
    ],
    recommendedPlanSlugs: ["mystery-diner", "restaurant-360", "restaurant-sop-audit"],
    faqs: [
      {
        q: "Do auditors evaluate the food itself?",
        a: "Auditors evaluate presentation, temperature, accuracy and service around the food — not culinary quality, which is a chef's craft judgement."
      },
      {
        q: "Can you audit delivery and take-away too?",
        a: "Yes. Delivery checks cover packaging, timing, order accuracy and the call/online ordering experience."
      },
      {
        q: "Can multiple outlets be benchmarked?",
        a: "Yes. Multi-outlet programs compare every location on one framework with a leadership report."
      }
    ],
    seo: {
      title: "Restaurant Mystery Audit & Service Audit",
      description:
        "Restaurant mystery dining and SOP audits covering reservations, greeting, service timing, menu knowledge, hygiene, upselling and billing — with evidence-backed scorecards.",
      keywords: ["restaurant mystery audit", "restaurant service audit", "mystery dining", "restaurant SOP audit", "cafe audit"]
    }
  },
  {
    slug: "hospitals-clinics",
    number: "03",
    title: "Hospitals & Clinics",
    shortTitle: "Hospitals",
    description:
      "Patient-facing service journeys, reception, appointment handling, communication, waiting experience and service SOPs.",
    auditTypes: ["Patient Experience", "Front Desk", "Call Handling", "Service SOP", "Facility Experience"],
    image: "/images/industries/hospitals-clinics.jpg",
    imageAlt: "Modern hospital reception with calm patient experience",
    heroEyebrow: "HOSPITALS & CLINICS",
    heroHeadline: "PATIENTS JUDGE CARE BY EVERYTHING AROUND IT.",
    heroSupport:
      "Clinical excellence can be undermined by a long queue, a cold reception, or an unanswered call. We audit the non-clinical service journey patients actually experience.",
    problem: {
      heading: "Great medicine. Difficult experience.",
      body: [
        "Patients and families rarely assess clinical quality directly — they assess how they were received, informed, guided and respected. Service friction becomes the memory of the visit.",
        "Healthcare launch scope is patient experience and non-clinical service standards. Clinical, medical, statutory or accreditation audits require separately qualified and authorized specialists."
      ]
    },
    journey: [
      { title: "Appointment / Call", caption: "Response, clarity, guidance, empathy" },
      { title: "Arrival & Reception", caption: "Greeting, queue, direction, paperwork ease" },
      { title: "Waiting Experience", caption: "Comfort, communication, status updates" },
      { title: "Wayfinding", caption: "Signage, guidance, staff direction quality" },
      { title: "Consultation Handover", caption: "Coordination, respect, privacy" },
      { title: "Billing & Exit", caption: "Clarity, speed, assistance at exit" }
    ],
    whatWeInspect: [
      "Appointment call and online enquiry handling",
      "Reception greeting, queue management and paperwork ease",
      "Waiting experience — comfort, communication and status updates",
      "Wayfinding, signage and staff guidance quality",
      "Front-desk service SOPs and documentation",
      "Patient-facing communication standards",
      "Facility service experience — seating, cleanliness, amenities",
      "Escalation and assistance handling"
    ],
    evidenceApproach: [
      "Time-stamped service observations at each touchpoint",
      "Queue and response-time measurement",
      "Documentation of observed service behaviour, tied to checkpoints",
      "No clinical assessment — service journey only"
    ],
    auditProcess: [
      { step: "Scope the facility", detail: "We map your patient service journey into checkpoints" },
      { step: "Match the auditor", detail: "A healthcare-service-experienced auditor visits" },
      { step: "The visit", detail: "A realistic patient-facing journey, documented" },
      { step: "Verification", detail: "Internal quality review of evidence and report" },
      { step: "Debrief", detail: "Service findings, scores and corrective actions" }
    ],
    scorecardExample: [
      { section: "Appointment & Call Handling", score: 86 },
      { section: "Reception & Arrival", score: 90 },
      { section: "Waiting Experience", score: 82 },
      { section: "Wayfinding & Guidance", score: 93 },
      { section: "Communication Standards", score: 88 },
      { section: "Billing & Exit", score: 91 }
    ],
    recommendedPlanSlugs: ["patient-journey-audit", "hospital-experience-360", "hospital-service-sop-audit"],
    faqs: [
      {
        q: "Do you audit clinical quality?",
        a: "No. AuditExpert's healthcare scope is patient experience and non-clinical service standards. Clinical, statutory or accreditation audits require separately qualified and authorized specialists."
      },
      {
        q: "How do you protect patient privacy during audits?",
        a: "Auditors observe service processes, not patient records. Assignments respect medical confidentiality, venue rules and applicable law."
      },
      {
        q: "Can clinics and small facilities be audited?",
        a: "Yes. Scoped single-journey audits work well for clinics and single-specialty facilities."
      }
    ],
    seo: {
      title: "Hospital Patient Experience Audit Services",
      description:
        "Patient experience and non-clinical service audits for hospitals and clinics — reception, appointment handling, waiting experience, communication and service SOPs.",
      keywords: ["hospital patient experience audit", "hospital service audit", "clinic audit", "patient journey audit", "healthcare service audit"]
    }
  },
  {
    slug: "malls-retail",
    number: "04",
    title: "Malls & Retail",
    shortTitle: "Malls & Retail",
    description:
      "Security, parking, signage, housekeeping, customer service, store interaction and overall visitor experience.",
    auditTypes: ["Mall Journey", "Retail Mystery Shop", "Helpdesk", "Security", "Housekeeping", "Brand Compliance"],
    image: "/images/industries/malls-retail.jpg",
    imageAlt: "Premium shopping mall atrium with architectural lighting",
    heroEyebrow: "MALLS & RETAIL",
    heroHeadline: "FOOTFALL FOLLOWS THE EXPERIENCE.",
    heroSupport:
      "Visitors may come for a store, but they remember the parking, the washroom, the helpdesk and the walk. We audit the complete visitor and shopper journey.",
    problem: {
      heading: "A mall is judged by its worst touchpoint.",
      body: [
        "A great anchor store can't compensate for a confusing car park, an unclean washroom, or a helpdesk that shrugs. Visitors experience the whole property — and rate it as one.",
        "Brands inside the mall have their own standards. Managing property services and tenant brand compliance together is where consistency gets hard."
      ]
    },
    journey: [
      { title: "Entry & Security", caption: "Greeting, screening, efficiency, courtesy" },
      { title: "Parking", caption: "Availability, guidance, lighting, assistance" },
      { title: "Wayfinding & Signage", caption: "Clarity, placement, condition" },
      { title: "Helpdesk & Services", caption: "Response, knowledge, attitude" },
      { title: "Store Interaction", caption: "Sampled retail service and selling standards" },
      { title: "Facilities", caption: "Washrooms, housekeeping, seating, ambience" }
    ],
    whatWeInspect: [
      "Entry and security screening experience",
      "Parking — availability, guidance, lighting and assistance",
      "Signage and wayfinding standards",
      "Helpdesk response, knowledge and attitude",
      "Housekeeping and washroom standards across zones",
      "Food-court service observations",
      "Retail mystery shop — sampled store interactions",
      "Safety-service observations and brand compliance"
    ],
    evidenceApproach: [
      "Zone-by-zone facility observations with timings",
      "Photographic evidence where permitted",
      "Sampled retail interactions scored on selling standards",
      "Visitor-journey structure, not checklist-in-a-vacuum"
    ],
    auditProcess: [
      { step: "Scope the property", detail: "We map zones, services and journey checkpoints" },
      { step: "Match the auditor", detail: "A retail/mall-experienced auditor visits as a visitor" },
      { step: "The visit", detail: "A complete visitor journey across touchpoints" },
      { step: "Verification", detail: "Internal quality review of evidence and report" },
      { step: "Debrief", detail: "Findings, scores and corrective actions with management" }
    ],
    scorecardExample: [
      { section: "Entry & Security", score: 92 },
      { section: "Parking", score: 78 },
      { section: "Signage & Wayfinding", score: 88 },
      { section: "Helpdesk", score: 85 },
      { section: "Housekeeping & Washrooms", score: 81 },
      { section: "Retail Interactions", score: 90 }
    ],
    recommendedPlanSlugs: ["mall-mystery-visit", "mall-experience-360", "mall-sop-audit"],
    faqs: [
      {
        q: "Can you audit individual stores inside a mall?",
        a: "Yes. Retail mystery shop modules sample store interactions on selling and service standards — individually or as part of a full mall journey."
      },
      {
        q: "Do you audit tenant brand compliance?",
        a: "Brand-compliance modules check tenant adherence to agreed standards — visual, service and housekeeping — as scoped with mall management."
      },
      {
        q: "Can multiple malls be compared?",
        a: "Yes. Multi-property programs benchmark every location on one framework."
      }
    ],
    seo: {
      title: "Mall & Retail Mystery Shopping Audit",
      description:
        "Mall journey audits and retail mystery shopping covering security, parking, signage, helpdesk, housekeeping, store interactions and brand compliance.",
      keywords: ["retail mystery shopping", "mall audit", "retail mystery audit", "mall customer experience audit", "store audit"]
    }
  },
  {
    slug: "cinemas",
    number: "05",
    title: "Cinemas & Multiplexes",
    shortTitle: "Cinemas",
    description:
      "Ticketing, queue time, staff behavior, F&B, auditorium readiness, washrooms, cleanliness and upselling.",
    auditTypes: ["Ticketing", "F&B", "Auditorium", "Staff", "Cleanliness", "Queue", "SOP Audit"],
    image: "/images/industries/cinemas.jpg",
    imageAlt: "Premium cinema auditorium with ambient step lighting",
    heroEyebrow: "CINEMAS & MULTIPLEXES",
    heroHeadline: "THE SHOW STARTS AT THE BOX OFFICE.",
    heroSupport:
      "A great film can't recover a 25-minute snack queue. We audit the complete cinema visit — booking to exit — where the guest experience actually begins.",
    problem: {
      heading: "The film is the product. The visit is the experience.",
      body: [
        "Cinemas compete with home screens on experience. Queue time, auditorium readiness, washroom condition and F&B service decide whether the ticket feels worth it — and whether the guest returns.",
        "Peak-show operations are exactly where standards slip. And that's precisely when the most guests are watching."
      ]
    },
    journey: [
      { title: "Booking", caption: "Online and counter experience, clarity" },
      { title: "Entry & Ticketing", caption: "Queue time, staff courtesy, efficiency" },
      { title: "F&B Counter", caption: "Speed, upselling, presentation, queue" },
      { title: "Auditorium", caption: "Readiness, seating, cleanliness, ambience" },
      { title: "Washrooms", caption: "Cleanliness, supplies, condition at peak" },
      { title: "Exit & Assistance", caption: "Crowd handling, courtesy, safety" }
    ],
    whatWeInspect: [
      "Booking journey — online and counter",
      "Entry and ticketing queue timing",
      "Staff behaviour and courtesy at every counter",
      "F&B service speed, upselling and presentation",
      "Auditorium readiness — seating, cleanliness, ambience",
      "Washroom condition at peak show times",
      "Crowd handling and guest assistance",
      "Cleanliness standards across zones"
    ],
    evidenceApproach: [
      "Timed queue and service measurements at peak",
      "Photographic evidence where permitted",
      "Auditorium readiness checks pre-show",
      "Structured scoring across every zone"
    ],
    auditProcess: [
      { step: "Scope the property", detail: "We map the visit journey and peak-time standards" },
      { step: "Match the auditor", detail: "An auditor visits as a normal moviegoer" },
      { step: "The visit", detail: "A complete cinema visit, observed and documented" },
      { step: "Verification", detail: "Internal quality review of evidence and report" },
      { step: "Debrief", detail: "Findings, scores and corrective actions with management" }
    ],
    scorecardExample: [
      { section: "Booking Journey", score: 93 },
      { section: "Ticketing & Queue", score: 84 },
      { section: "F&B Service", score: 79 },
      { section: "Auditorium Readiness", score: 90 },
      { section: "Washrooms at Peak", score: 76 },
      { section: "Staff Courtesy", score: 88 }
    ],
    recommendedPlanSlugs: ["mystery-movie", "cinema-360", "cinema-sop-audit"],
    faqs: [
      {
        q: "Do auditors watch the film?",
        a: "Auditors observe the visit experience — booking, queues, service, facilities. The film itself is not scored."
      },
      {
        q: "Can you audit at peak show times?",
        a: "Yes — peak-show audits are often the most revealing, and timing is agreed during scoping."
      },
      {
        q: "Can a full multiplex network be audited?",
        a: "Yes. Multi-location programs cover every property with benchmarking and leadership reporting."
      }
    ],
    seo: {
      title: "Cinema & Multiplex Mystery Audit Services",
      description:
        "Cinema mystery audits covering ticketing, queue times, F&B service, auditorium readiness, washroom cleanliness and staff behaviour — with evidence-backed scoring.",
      keywords: ["cinema mystery audit", "multiplex audit", "cinema customer experience audit", "theatre audit"]
    }
  },
  {
    slug: "salons-spas",
    number: "06",
    title: "Salons & Spas",
    shortTitle: "Salons & Spas",
    description:
      "Booking, consultation, hygiene, therapist/stylist behavior, upselling, privacy, billing and rebooking.",
    auditTypes: ["Mystery Visit", "Consultation", "Hygiene", "Upselling", "Service SOP", "Rebooking"],
    image: "/images/industries/salons-spas.jpg",
    imageAlt: "Luxury salon interior with premium styling station",
    heroEyebrow: "SALONS & SPAS",
    heroHeadline: "TRUST IS BUILT IN THE CONSULTATION CHAIR.",
    heroSupport:
      "Salons and spas sell trust — consultation, hygiene, privacy and professionalism decide the repeat visit. We audit the complete client journey with discretion.",
    problem: {
      heading: "The service is personal. So is the risk.",
      body: [
        "A salon guest notices everything: the trolley hygiene, the consultation depth, the upsell pressure, the privacy at the spa. One uncomfortable visit ends the relationship — quietly, without a complaint.",
        "Chains feel it most: consistency across stylists, shifts and outlets is the brand promise, and the hardest thing to keep."
      ]
    },
    journey: [
      { title: "Booking", caption: "Call / WhatsApp response, clarity, availability" },
      { title: "Welcome", caption: "Greeting, wait comfort, beverage offer" },
      { title: "Consultation", caption: "Needs analysis, advice quality, honesty" },
      { title: "Service", caption: "Skill observation, hygiene, professionalism" },
      { title: "Privacy & Comfort", caption: "Discretion, comfort, respect" },
      { title: "Billing & Rebooking", caption: "Transparency, upselling, rebook attempt" }
    ],
    whatWeInspect: [
      "Booking and enquiry handling — call and WhatsApp",
      "Welcome, wait comfort and hospitality gestures",
      "Consultation quality — needs analysis and advice",
      "Hygiene standards — tools, trolley, towels, station",
      "Therapist / stylist behaviour and professionalism",
      "Privacy and comfort through the service",
      "Product handling and retail upselling",
      "Billing transparency and rebooking attempt"
    ],
    evidenceApproach: [
      "Discreet observation through a real service journey",
      "Hygiene and consultation standards scored against checkpoints",
      "Photographic evidence where permitted and appropriate",
      "Structured scoring — service quality, not craft judgement"
    ],
    auditProcess: [
      { step: "Scope the brand", detail: "We map your client journey and standards into checkpoints" },
      { step: "Match the auditor", detail: "A service-experienced auditor books and visits discreetly" },
      { step: "The visit", detail: "A complete service journey, observed and documented" },
      { step: "Verification", detail: "Internal quality review of evidence and report" },
      { step: "Debrief", detail: "Findings, scores and corrective actions with management" }
    ],
    scorecardExample: [
      { section: "Booking & Enquiry", score: 88 },
      { section: "Welcome & Hospitality", score: 91 },
      { section: "Consultation Quality", score: 85 },
      { section: "Hygiene Standards", score: 93 },
      { section: "Privacy & Comfort", score: 90 },
      { section: "Billing & Rebooking", score: 83 }
    ],
    recommendedPlanSlugs: ["mystery-salon-visit", "salon-experience-360", "salon-sop-audit"],
    faqs: [
      {
        q: "Do auditors actually take the service?",
        a: "Yes — a realistic journey usually includes a service such as a haircut or basic treatment, scoped and agreed in advance."
      },
      {
        q: "Is the audit discreet for staff and other clients?",
        a: "Absolutely. Auditors behave as normal clients; findings are reported confidentially to management."
      },
      {
        q: "Can salon chains be benchmarked across outlets?",
        a: "Yes. Multi-outlet programs compare every location on one framework with trend reporting."
      }
    ],
    seo: {
      title: "Salon & Spa Mystery Audit Services",
      description:
        "Salon and spa mystery audits covering booking, consultation, hygiene, therapist behaviour, privacy, upselling and rebooking — with evidence-backed scorecards.",
      keywords: ["salon mystery audit", "spa audit", "salon mystery shopping", "spa service audit", "beauty audit"]
    }
  }
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getIndustriesNav() {
  return industries.map(({ slug, title, number, description }) => ({
    slug,
    title,
    number,
    description
  }));
}
