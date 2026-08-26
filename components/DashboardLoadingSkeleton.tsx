"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const statLabels = ["Total views", "Visitors", "Pages", "Referrers"];
const panelTitles = ["Top pages", "Devices", "Referrers"];

export default function DashboardLoadingSkeleton() {
  const container = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = container.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to(".loading-skeleton", {
        opacity: 0.7,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
      });
    }, element);

    return () => context.revert();
  }, []);

  return (
    <main
      ref={container}
      aria-label="Loading dashboard"
      className="bg-paper font-sans text-ink"
    >
      <section className="grid grid-cols-2 divide-x-[0.5px] divide-border border-b-[0.5px] border-border sm:grid-cols-4">
        {statLabels.map((label) => (
          <div key={label} className="px-5 py-4">
            <p className="font-mono text-[11px] tracking-[0.5px] text-muted">
              {label.toUpperCase()}
            </p>
            <div className="loading-skeleton mt-2 h-7 w-20 rounded bg-paper-grid" />
          </div>
        ))}
      </section>

      <section className="px-5 py-5">
        <div className="loading-skeleton h-64 rounded-xl border-[0.5px] border-border bg-paper-grid/60 sm:h-80" />
      </section>

      <section className="grid grid-cols-1 divide-y-[0.5px] divide-border border-t-[0.5px] border-border sm:grid-cols-3 sm:divide-x-[0.5px] sm:divide-y-0">
        {panelTitles.map((title) => (
          <div key={title} className="px-5 py-4">
            <p className="mb-3 font-mono text-[11px] tracking-[0.5px] text-muted">
              {title.toUpperCase()}
            </p>
            <div className="space-y-3">
              <div className="loading-skeleton h-3 w-3/4 rounded bg-paper-grid" />
              <div className="loading-skeleton h-3 w-1/2 rounded bg-paper-grid" />
              <div className="loading-skeleton h-3 w-2/3 rounded bg-paper-grid" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
