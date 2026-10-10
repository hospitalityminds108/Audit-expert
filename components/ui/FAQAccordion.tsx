"use client";

import { useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";

interface FAQItem {
  q: string;
  a: string;
}

interface Props {
  items: readonly FAQItem[];
  /** Which item is open by default */
  defaultOpen?: number;
  /** Surface the accordion sits on */
  tone?: "dark" | "light";
  className?: string;
}

const tones = {
  dark: {
    wrap: "divide-fg-100/10 border-fg-100/10",
    button: "hover:text-accent",
    index: "text-accent/80",
    question: "text-fg-100",
    icon: "text-accent",
    answer: "text-fg-400"
  },
  light: {
    wrap: "divide-fg-50/10 border-fg-50/10",
    button: "hover:text-accent",
    index: "text-accent",
    question: "text-fg-50",
    icon: "text-accent",
    answer: "text-fg-300"
  }
} as const;

export default function FAQAccordion({ items, defaultOpen = -1, tone = "dark", className = "" }: Props) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const uid = useId();
  const t = tones[tone];

  const animate = (i: number, show: boolean) => {
    const el = refs.current[i];
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, {
      height: show ? "auto" : 0,
      opacity: show ? 1 : 0,
      duration: reduced ? 0 : 0.5,
      ease: "power3.inOut",
      overwrite: true
    });
  };

  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    if (open !== -1) animate(open, false);
    if (next !== -1) animate(next, true);
    setOpen(next);
  };

  return (
    <div className={`divide-y border-y ${t.wrap} ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const startsOpen = defaultOpen === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              id={`${uid}-q-${i}`}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`${uid}-a-${i}`}
              className={`flex w-full items-center justify-between gap-6 py-6 text-left transition-colors ${t.button}`}
            >
              <span className="flex items-baseline gap-4">
                <span className={`font-mono text-[11px] ${t.index}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-display text-lg font-medium md:text-xl ${t.question}`}>
                  {item.q}
                </span>
              </span>
              <Plus
                size={18}
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-500 ease-premium ${t.icon} ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${uid}-a-${i}`}
              className="overflow-hidden"
              style={startsOpen ? undefined : { height: 0, opacity: 0 }}
              role="region"
              aria-labelledby={`${uid}-q-${i}`}
              aria-hidden={!isOpen}
            >
              <p className={`max-w-3xl pb-7 pl-9 pr-2 text-[15px] leading-relaxed ${t.answer}`}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
