import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import IndustryMarquee from "@/components/home/IndustryMarquee";
import Testimonials from "@/components/home/Testimonials";
import TwoWays from "@/components/home/TwoWays";
import IndustriesBento from "@/components/home/IndustriesBento";
import AuditPlanExplorer from "@/components/home/AuditPlanExplorer";
import MultiLocationProgram from "@/components/home/MultiLocationProgram";
import MethodologyTimeline from "@/components/home/MethodologyTimeline";
import WhatTheBrandGets from "@/components/home/WhatTheBrandGets";
import FuturePlatform from "@/components/home/FuturePlatform";
import JoinAsAuditor from "@/components/home/JoinAsAuditor";
import HomeFAQ from "@/components/home/HomeFAQ";
import { siteConfig } from "@/data/site";
import { generalFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: "/images/hero.jpg", width: 1536, height: 1024, alt: siteConfig.name }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: `${siteConfig.address.locality}, ${siteConfig.address.city}`,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  },
  parentOrganization: {
    "@type": "Organization",
    name: "HospitalityMinds",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { "@type": "Organization", name: siteConfig.name },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: generalFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, websiteJsonLd, faqJsonLd]),
        }}
      />
      <Hero />
      <IndustryMarquee />
      <TwoWays />
      <IndustriesBento />
      <AuditPlanExplorer />
      <MultiLocationProgram />
      <MethodologyTimeline />
      <WhatTheBrandGets />
      <Testimonials />
      <FuturePlatform />
      <JoinAsAuditor />
      <HomeFAQ />
    </>
  );
}
