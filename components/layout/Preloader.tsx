"use client";

import { useEffect, useState } from "react";

/** Total run time of the CSS sequence in globals.css (.preloader), in ms */
export const PRELOADER_MS = 4000;
const STORAGE_KEY = "ae-preloaded";

/**
 * Preloader — plays once per browser session.
 * An auditor works through a checklist on a laptop; when the last item is
 * ticked the scene resolves into the AuditExpert logo and the curtain lifts.
 *
 * The whole sequence is CSS, so it runs before hydration and always ends on
 * its own. An inline script in layout.tsx adds `.preloaded` to <html> for
 * returning visits, which keeps this hidden from the first paint.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("preloaded")) {
      setDone(true);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      root.classList.add("preloaded");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode: the preloader simply plays again next load */
      }
      setDone(true);
    };
    if (reduced) {
      finish();
      return;
    }
    const t = setTimeout(finish, PRELOADER_MS);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="preloader" role="status" aria-label="Loading AuditExpert">
      {/* ── Scene: an auditor at a laptop ── */}
      <div className="pl-scene">
        <svg viewBox="0 0 360 250" className="h-auto w-[min(84vw,520px)]" fill="none" aria-hidden="true">
          {/* soft floor shadow */}
          <ellipse cx="170" cy="234" rx="140" ry="9" fill="#0E9F4F" opacity="0.1" />

          {/* chair */}
          <rect x="54" y="112" width="9" height="70" rx="4.5" fill="#C9D6E2" />
          <rect x="54" y="174" width="70" height="9" rx="4.5" fill="#C9D6E2" />
          <rect x="85" y="183" width="7" height="42" fill="#C9D6E2" />
          <rect x="62" y="223" width="54" height="6" rx="3" fill="#C9D6E2" />

          {/* legs */}
          <rect x="92" y="158" width="74" height="18" rx="9" fill="#0B1F3A" />
          <rect x="150" y="166" width="16" height="58" rx="8" fill="#0B1F3A" />
          <rect x="148" y="218" width="30" height="10" rx="5" fill="#0B1F3A" />

          {/* torso */}
          <rect x="72" y="106" width="46" height="70" rx="20" fill="#0E9F4F" />

          {/* head */}
          <g className="pl-head">
            <rect x="91" y="96" width="13" height="14" rx="5" fill="#F0C29B" />
            <circle cx="98" cy="82" r="18" fill="#F4CCA8" />
            <path d="M80 80c0-11 8-19 19-19 9 0 16 5 18 13-9-5-21-5-30 2-3 2-5 4-7 4z" fill="#0B1F3A" />
          </g>

          {/* desk */}
          <rect x="150" y="170" width="190" height="8" rx="4" fill="#0B1F3A" />
          <rect x="318" y="178" width="8" height="48" fill="#0B1F3A" />
          <rect x="304" y="224" width="36" height="6" rx="3" fill="#0B1F3A" />

          {/* laptop */}
          <rect x="176" y="163" width="78" height="7" rx="3.5" fill="#B9C7D4" />
          <path d="M252 164L270 104" stroke="#0B1F3A" strokeWidth="7" strokeLinecap="round" />
          <path className="pl-glow" d="M262 108L232 152" stroke="#0E9F4F" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

          {/* arm — upper arm fixed, forearm types */}
          <path d="M104 124L130 152" stroke="#0B8A45" strokeWidth="14" strokeLinecap="round" />
          <g className="pl-forearm">
            <path d="M130 152L186 158" stroke="#F4CCA8" strokeWidth="11" strokeLinecap="round" />
            <path d="M130 152L152 154" stroke="#0B8A45" strokeWidth="14" strokeLinecap="round" />
          </g>

          {/* audit checklist floating above the laptop */}
          <g className="pl-card">
            <rect x="222" y="18" width="126" height="78" rx="12" fill="#FFFFFF" stroke="#CFE6D8" strokeWidth="1.5" />
            <rect x="234" y="29" width="46" height="5" rx="2.5" fill="#0B1F3A" />
            <circle cx="336" cy="31.5" r="3" fill="#0E9F4F" />

            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x="234" y={43 + i * 17} width="11" height="11" rx="3" stroke="#0E9F4F" strokeWidth="1.5" />
                <path
                  className={`pl-check pl-check-${i + 1}`}
                  d={`M236.5 ${48.8 + i * 17}l2.6 2.8 4.6-5.6`}
                  stroke="#0E9F4F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="252" y={46 + i * 17} width={[72, 58, 66][i]} height="5" rx="2.5" fill="#DCE9E1" />
                <rect
                  className={`pl-line pl-line-${i + 1}`}
                  x="252"
                  y={46 + i * 17}
                  width={[72, 58, 66][i]}
                  height="5"
                  rx="2.5"
                  fill="#0E9F4F"
                  opacity="0.55"
                />
              </g>
            ))}
          </g>
        </svg>

        <p className="pl-caption">
          Auditing<span className="pl-dot">.</span>
          <span className="pl-dot">.</span>
          <span className="pl-dot">.</span>
        </p>
      </div>

      {/* ── Logo ── */}
      <div className="pl-logo">
        {/* eslint-disable-next-line @next/next/no-img-element -- must paint before hydration, without the image optimizer round-trip */}
        <img src="/images/logo.png" alt="AuditExpert.com — Observe, Improve, Build Trust" width={984} height={213} />
        <span className="pl-sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
