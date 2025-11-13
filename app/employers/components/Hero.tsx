"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/src/components/Button";

export function EmployersHero() {
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
      className="relative overflow-hidden bg-grid bg-surface/60 text-main-text"
    >
      {/* Subtle grid/pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 relative z-10 text-center">
        {/* Title with accent */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-title font-bold text-main-text"
        >
          Hire Skilled Trades <span className="text-main-accent">Faster</span>
        </h1>

        {/* Copy */}
        <p
          ref={textRef}
          className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed text-main-light-text"
        >
          America's skilled trades shortage is real. Guildustry connects you
          with motivated, qualified candidates ready to work.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 flex justify-center">
          <Button variant="accent" size="lg" asChild>
            <Link href="/employers" className="inline-flex items-center gap-2">
              <span>Start Hiring Today</span>
              <Icon icon="lucide:arrow-right" className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
