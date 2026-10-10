"use client";

import { useMemo } from "react";
import { useSplitReveal } from "@/lib/animations/gsap";

interface Props {
  text: string | string[];
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  stagger?: number;
  start?: string;
  delay?: number;
  /** Highlight words matching these (case-insensitive) in brass */
  highlight?: string[];
}

/**
 * AnimatedText — splits text into words, staggers a masked reveal.
 * Pass an array for multi-line control.
 */
export default function AnimatedText({
  text,
  as: Tag = "h2",
  className = "",
  stagger,
  start,
  delay,
  highlight = []
}: Props) {
  const ref = useSplitReveal<HTMLHeadingElement>({ stagger, start, delay });
  const lines = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const highlights = useMemo(() => highlight.map((h) => h.toLowerCase()), [highlight]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="split-line">
          <span className="split-line-inner">
            {line.split(" ").map((word, j) => {
              const isHi = highlights.includes(word.replace(/[.,:!?—–]/g, "").toLowerCase());
              return (
                <span key={j} className={`split-word ${isHi ? "text-accent" : ""}`}>
                  {word}
                  {"\u00A0"}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </Tag>
  );
}
