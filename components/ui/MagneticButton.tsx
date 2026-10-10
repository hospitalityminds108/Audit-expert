"use client";

import { forwardRef, type ReactNode, type MouseEvent, type Ref } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/lib/animations/gsap";

function mergeRefs<T>(...refs: (Ref<T> | null | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((r) => {
      if (typeof r === "function") r(node);
      else if (r) {
        (r as { current: T | null }).current = node;
      }
    });
  };
}

interface Props {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "lg";
  magnetic?: boolean;
  showArrow?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

const styles = {
  primary: "btn-primary",
  outline: "btn-ghost",
  ghost: "text-fg-200 hover:text-accent underline-offset-4 hover:underline"
} as const;

const sizes = {
  md: "px-7 py-3.5 text-[13px]",
  lg: "px-9 py-4.5 text-sm"
} as const;

/**
 * MagneticButton — premium CTA with magnetic hover (desktop).
 */
const MagneticButton = forwardRef<HTMLDivElement, Props>(function MagneticButton(
  {
    href,
    children,
    variant = "primary",
    size = "md",
    magnetic = true,
    showArrow = false,
    className = "",
    onClick,
    type = "button",
    disabled,
    ariaLabel
  },
  ref
) {
  const magRef = useMagnetic<HTMLDivElement>(magnetic ? 0.3 : 0);
  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <ArrowUpRight
          size={16}
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );

  const cls = `group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-all duration-500 ease-premium disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`;

  return (
    <div
      ref={mergeRefs(magRef, ref)}
      className="inline-block"
    >
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          className={cls}
          data-interactive
          aria-label={ariaLabel}
        >
          {content}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick as never}
          className={cls}
          disabled={disabled}
          aria-label={ariaLabel}
          data-interactive
        >
          {content}
        </button>
      )}
    </div>
  );
});

export default MagneticButton;
