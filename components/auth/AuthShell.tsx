import { Suspense, type ReactNode } from "react";
import Image from "next/image";
import { BadgeCheck, FileText, ShieldCheck } from "lucide-react";

const POINTS = [
  { icon: FileText, text: "Every booking, reference and report in one place" },
  { icon: BadgeCheck, text: "Faster checkout — your details are remembered" },
  { icon: ShieldCheck, text: "Passwords are hashed; sessions use a signed, httpOnly cookie" },
];

/**
 * AuthShell — split layout shared by /login and /signup:
 * the form on glass, a photo panel alongside on large screens.
 */
export default function AuthShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="container-site pb-24 pt-32 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[1.05fr_1fr]">
        {/* Form */}
        <div className="glass rounded-3xl border border-fg-50/10 p-7 sm:p-10 md:p-12">
          <p className="eyebrow">
            <span className="eyebrow-rule" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.015em] text-fg-50 md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-300">{lead}</p>
          <div className="mt-9">
            {/* useSearchParams in the form needs a Suspense boundary */}
            <Suspense fallback={<div className="h-80" aria-hidden="true" />}>{children}</Suspense>
          </div>
        </div>

        {/* Photo panel */}
        <aside className="relative hidden min-h-[560px] overflow-hidden rounded-3xl border border-fg-50/10 lg:block">
          <Image
            src="/images/sections/city.jpg"
            alt="City skyline at dusk"
            fill
            sizes="(min-width: 1024px) 40vw, 0px"
            className="object-cover opacity-55"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/75 to-base-950/20"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 p-9">
            <p className="font-display text-3xl leading-[1.15] text-fg-50">
              See what your customers experience.
              <span className="block text-gradient-brand">Know what your teams deliver.</span>
            </p>
            <ul className="mt-7 space-y-3.5">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-fg-200">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-500/40 bg-white/70 text-accent">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
