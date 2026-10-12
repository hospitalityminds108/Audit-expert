import Image from "next/image";
import Link from "next/link";

interface Props {
  compact?: boolean;
  /** "wordmark" for the header; "full" adds the tagline line (footer) */
  variant?: "wordmark" | "full";
  className?: string;
}

const FILES = {
  wordmark: { src: "/images/logo-wordmark.png", width: 984, height: 169 },
  full: { src: "/images/logo.png", width: 984, height: 213 },
} as const;

/**
 * AuditExpert.com logo, linking home.
 */
export default function Logo({ compact = false, variant = "wordmark", className = "" }: Props) {
  const file = FILES[variant];
  const height = variant === "full" ? "h-14" : compact ? "h-7" : "h-8 sm:h-9";

  return (
    <Link href="/" aria-label="AuditExpert — home" className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src={file.src}
        alt="AuditExpert.com"
        width={file.width}
        height={file.height}
        priority={variant === "wordmark"}
        sizes="(min-width: 640px) 220px, 180px"
        className={`w-auto transition-all duration-500 ease-premium ${height}`}
      />
    </Link>
  );
}
