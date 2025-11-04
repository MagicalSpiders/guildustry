"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/src/components/Button";

export function CandidatesHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.6 },
      });
      tl.from(badgeRef.current, { y: -16, autoAlpha: 0 })
        .from(titleRef.current, { y: 20, autoAlpha: 0 }, "-=0.2")
        .from(textRef.current, { y: 16, autoAlpha: 0 }, "-=0.25")
        .from(ctaRef.current, { y: 10, autoAlpha: 0 }, "-=0.25");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-grid bg-white/60 text-neutral-900 dark:bg-main-bg dark:text-main-text"
    >
      {/* Subtle grid/pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32 relative z-10 text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center px-4 py-2 rounded-full border border-main-accent bg-white/80 dark:bg-surface/80 backdrop-blur-sm"
        >
          <span className="text-main-accent font-medium text-sm">
            100% FREE to Join
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-title font-bold text-main-text"
        >
          Build a Career Without Debt
        </h1>

        {/* Copy */}
        <p
          ref={textRef}
          className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-main-light-text leading-relaxed"
        >
          Skilled trades offer stability, high pay, and respect. No college
          degree required. Start earning from day one.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 flex justify-center">
          <Button variant="accent" size="lg" asChild>
            <Link href="/candidates" className="inline-flex items-center gap-2">
              <span>Find Your Path</span>
              <Icon icon="lucide:arrow-right" className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
