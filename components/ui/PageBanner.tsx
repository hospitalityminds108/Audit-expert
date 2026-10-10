"use client";

import Image from "next/image";
import { useInView } from "@/lib/animations/gsap";

interface BannerImage {
  src: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: readonly BannerImage[];
  className?: string;
  /** Load eagerly when the banner sits in the first screen */
  priority?: boolean;
}

/**
 * PageBanner — a row of framed photographs that open with a soft wipe as they
 * scroll into view. One image fills the row; two or three share it.
 * The reveal is pure CSS (see .media-reveal), so there is nothing to stall.
 */
export default function PageBanner({ images, className = "", priority = false }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const single = images.length === 1;

  return (
    <div
      ref={ref}
      className={`grid gap-4 ${single ? "" : images.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} ${className}`}
    >
      {images.map((img, i) => (
        <figure
          key={img.src}
          data-inview={inView}
          style={{ transitionDelay: `${i * 120}ms` }}
          className={`media-reveal group relative overflow-hidden rounded-[28px] shadow-[0_40px_80px_-48px_rgba(16,64,44,0.6)] ${
            single ? "aspect-[4/3] sm:aspect-[21/9]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={priority && i === 0}
            sizes={single ? "(min-width: 1408px) 1280px, 92vw" : "(min-width: 640px) 33vw, 92vw"}
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-tr from-brand-700/50 via-brand-500/5 to-transparent"
            aria-hidden="true"
          />
          {img.caption && (
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-100">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
