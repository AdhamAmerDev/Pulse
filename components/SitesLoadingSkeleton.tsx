"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const placeholderRows = ["site-one.com", "site-two.com", "site-three.com"];

export default function SitesLoadingSkeleton() {
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
      gsap.to(".sites-loading-skeleton", {
        opacity: 0.65,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });
    }, element);

    return () => context.revert();
  }, []);

  return (
    <main ref={container} aria-label="Loading sites" className="bg-paper">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="sites-loading-skeleton h-3 w-20 rounded bg-paper-grid" />
        <div className="sites-loading-skeleton h-7 w-20 rounded-xl bg-paper-grid" />
      </div>
      <ul className="border-t-[0.5px] border-border">
        {placeholderRows.map((site) => (
          <li key={site} className="border-b-[0.5px] border-border px-5 py-3.5">
            <div className="sites-loading-skeleton h-3 w-32 rounded bg-paper-grid" />
          </li>
        ))}
      </ul>
    </main>
  );
}
