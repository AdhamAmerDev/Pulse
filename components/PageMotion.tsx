"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = container.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }, element);

    return () => context.revert();
  }, []);

  return <div ref={container}>{children}</div>;
}
