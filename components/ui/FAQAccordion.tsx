"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";

interface FAQItem {
  q: string;
  a: string;
}

interface Props {
  items: FAQItem[];
  /** Which item is open by default */
  defaultOpen?: number;
  className?: string;
}

export default function FAQAccordion({ items, defaultOpen = -1, className = "" }: Props) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    const isOpen = open === i;
    setOpen(isOpen ? -1 : i);
    gsap.to(el, {
      height: isOpen ? 0 : "auto",
      duration: 0.5,
      ease: "power3.inOut",
      opacity: isOpen ? 0 : 1
    });
  };

  return (
    <div className={`divide-y divide-bone-100/8 border-y border-bone-100/8 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-brass-200"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-brass-400/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg font-medium text-bone-100 md:text-xl">
                  {item.q}
                </span>
              </span>
              <Plus
                size={18}
                aria-hidden="true"
                className={`shrink-0 text-brass-300 transition-transform duration-500 ease-premium ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="overflow-hidden"
              style={{ height: 0, opacity: 0 }}
              role="region"
              aria-hidden={!isOpen}
            >
              <p className="max-w-3xl pb-7 pl-9 pr-2 text-[15px] leading-relaxed text-bone-400">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
