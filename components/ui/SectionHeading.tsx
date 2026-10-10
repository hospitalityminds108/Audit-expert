import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Renders title via AnimatedText (client) */
  animated?: boolean;
}

import AnimatedText from "./AnimatedText";

/**
 * SectionHeading — consistent editorial section header.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
  animated = true
}: Props) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start";
  return (
    <div className={`flex max-w-4xl flex-col gap-5 ${alignCls} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {animated && typeof title === "string" ? (
        <AnimatedText
          text={title}
          as="h2"
          className="text-balance text-display-md font-semibold text-fg-100 md:text-display-lg"
        />
      ) : null}
      {!(animated && typeof title === "string") && (
        <h2 className="text-balance text-display-md font-semibold text-fg-100 md:text-display-lg">
          {title}
        </h2>
      )}
      {lead && (
        <p className={`max-w-2xl text-lead text-fg-400 ${align === "center" ? "mx-auto" : ""}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
