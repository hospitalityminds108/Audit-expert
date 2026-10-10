import { Sparkle } from "lucide-react";
import { industries } from "@/data/industries";

const WORDS = [
  ...industries.map((i) => i.title),
  "Mystery Audits",
  "SOP Audits",
  "Multi-location Programs",
];

/**
 * IndustryMarquee — a continuous band of what we audit, between the hero and
 * the first section. Two rows drift in opposite directions; the list is
 * duplicated so the loop is seamless, and the copy is hidden from assistive tech.
 */
export default function IndustryMarquee() {
  const row = (reverse: boolean, outlined: boolean) => (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || undefined}>
            {WORDS.map((word) => (
              <li key={word} className="flex items-center">
                <span
                  className={`whitespace-nowrap px-6 font-display text-3xl tracking-[-0.01em] md:px-9 md:text-5xl ${
                    outlined ? "text-brand-600/25" : "text-fg-50"
                  }`}
                >
                  {word}
                </span>
                <Sparkle className="h-4 w-4 shrink-0 text-brand-500 md:h-5 md:w-5" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );

  return (
    <section
      aria-label="Industries and audit formats"
      className="relative space-y-3 border-y border-fg-50/10 bg-gradient-to-r from-brand-100/40 via-white/40 to-aqua-100/40 py-7 md:space-y-4 md:py-9"
    >
      {row(false, false)}
      {row(true, true)}
    </section>
  );
}
