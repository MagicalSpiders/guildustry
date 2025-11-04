"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ContactHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.6 } });
      tl.from(titleRef.current, { y: 20, autoAlpha: 0 })
        .from(textRef.current, { y: 16, autoAlpha: 0 }, "-=0.25");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-grid bg-white/60 text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 relative z-10 text-center">
        <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-title font-bold">
          Get in <span className="text-main-accent">Touch</span>
        </h1>
        <p ref={textRef} className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-neutral-700 dark:text-main-light-text leading-relaxed">
          Have questions? We're here to help. Reach out for support or partnership opportunities.
        </p>
      </div>
    </section>
  );
}


