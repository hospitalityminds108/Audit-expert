import Link from "next/link";

interface Props {
  compact?: boolean;
  className?: string;
}

/**
 * AuditExpert logotype — bracket-mark + wordmark.
 */
export default function Logo({ compact = false, className = "" }: Props) {
  return (
    <Link
      href="/"
      aria-label="AuditExpert — home"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <svg
        width={compact ? 30 : 34}
        height={compact ? 30 : 34}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-500 ease-premium group-hover:rotate-90"
      >
        <rect x="1.5" y="1.5" width="37" height="37" rx="4" stroke="currentColor" strokeWidth="1.6" className="text-brass-400" />
        <path d="M8 28L16 10L24 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-bone-100" />
        <path d="M11.5 22.5H20.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-bone-100" />
        <circle cx="28.5" cy="14" r="3.2" stroke="currentColor" strokeWidth="2" className="text-brass-300" />
        <path d="M30.8 16.3L34 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brass-300" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-tight text-bone-100 transition-all duration-500 ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          Audit<span className="text-brass-300">Expert</span>
        </span>
        <span
          className={`font-mono uppercase text-bone-500 transition-all duration-500 ${
            compact ? "text-[8px] tracking-[0.28em]" : "text-[9px] tracking-[0.32em]"
          }`}
        >
          Service Intelligence
        </span>
      </span>
    </Link>
  );
}
