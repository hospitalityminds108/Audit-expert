import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { industries } from "@/data/industries";
import { auditPlans } from "@/data/audit-plans";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1.0 },
    { path: "/industries", priority: 0.9 },
    { path: "/audit-plans", priority: 0.9 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/book-an-audit", priority: 0.9 },
    { path: "/join-as-auditor", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/cookies", priority: 0.2 },
  ].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((ind) => ({
    url: `${base}/industries/${ind.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const planRoutes: MetadataRoute.Sitemap = auditPlans.map((plan) => ({
    url: `${base}/audit-plans/${plan.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...industryRoutes, ...planRoutes];
}
