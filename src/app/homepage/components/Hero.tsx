"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const introTextRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    // Register plugin on client only
    if (typeof window === "undefined") return;
    // Safe to call multiple times; GSAP ignores duplicate registrations
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=80%",
          scrub: true,
          pin: true,
        },
      });

      timeline
        .fromTo(sheetRef.current, { y: "30%" }, { y: "0%", ease: "none" })
        .fromTo(
          introTextRef.current,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -16, ease: "power1.out" },
          "<"
        )
        .fromTo(
          contentRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, ease: "power1.out" },
          "<25%"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background video (behind everything) */}
      <div className="relative   h-full ">
        <div className="absolute w-screen h-full   inset-0 -z-10">
          <video
            className="h-full w-screen object-cover"
            src="/output.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="absolute w-screen h-full bg-white/20 dark:bg-black/20 inset-0 blur-sm" />
      </div>

      {/* Theme-aware subtle grid above video but below content */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* White sheet that slides up to cover the video on scroll */}

      <div
        ref={sheetRef}
        className="absolute inset-0 w-screen z-0 bg-surface   translate-y-1/2 will-change-transform transform-gpu"
        aria-hidden="true"
      >
        {/* Intro text shown in the visible (bottom) half initially */}
        <div
          ref={introTextRef}
          className="absolute left-1/2 -translate-x-1/2 top-6 md:top-10 w-full max-w-6xl px-6 md:px-8 text-main-light-text text-sm md:text-base font-body"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-10">
            {/* Left: Rich intro text and feature icons */}
            <div className="md:col-span-8 text-left">
              <h1 className="font-bold text-main-text mt-8 md:mt-16 mb-4 md:mb-6 font-title leading-tight">
                <span className="block text-3xl sm:text-5xl lg:text-6xl">
                  America Needs Builders.
                </span>
                <span className="block text-main-accent mt-1 md:mt-2 text-xl sm:text-4xl lg:text-6xl">
                  Step Into the Future of
                </span>
                <span className="block text-main-accent text-xl sm:text-4xl lg:text-6xl">
                  Skilled Trades.
                </span>
              </h1>
              <p className="text-main-light-text max-w-2xl leading-relaxed text-sm sm:text-base">
                Find high‑paying jobs that offer stability—without the burden of
                college debt. Build a meaningful career in construction,
                electrical, HVAC, welding, manufacturing, and more.
              </p>
              {/* Feature bullets with SVG icons */}
              <ul className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-main-light-text">
                <li className="flex items-center gap-2">
                  <Icon
                    icon="lucide:badge-check"
                    className="w-5 h-5 text-main-accent"
                  />
                  Verified employers
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    icon="lucide:coins"
                    className="w-5 h-5 text-main-accent"
                  />
                  High‑paying roles
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    icon="lucide:clock"
                    className="w-5 h-5 text-main-accent"
                  />
                  Fast placement
                </li>
              </ul>
            </div>

            {/* Right: Big scroll button */}
            <div className="md:col-span-4 flex md:justify-end justify-center mt-4 md:mt-0">
              <a
                href="#main-hero"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("main-hero");
                  if (target) {
                    const y =
                      target.getBoundingClientRect().top + window.scrollY + 600;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  } else {
                    // Fallback to location hash if element not found
                    window.location.hash = "main-hero";
                  }
                }}
                className="group inline-flex items-center gap-4 rounded-full border border-subtle bg-surface/80 backdrop-blur-md shadow-elevated hover:shadow-lg transition-all px-4 py-3 md:px-5 md:py-4"
                aria-label="Scroll down to explore"
              >
                <span className="relative inline-flex items-center justify-center rounded-full border border-subtle bg-surface/90 size-12 md:size-14">
                  <Icon
                    icon="lucide:chevrons-down"
                    className="w-6 h-6 md:w-7 md:h-7 text-main-light-text group-hover:text-main-accent transition-colors"
                  />
                </span>
                <div className="text-main-light-text leading-tight">
                  <span className="block text-[11px] md:text-xs uppercase tracking-wide text-main-light-text opacity-70">
                    Scroll down
                  </span>
                  <span className="block text-sm md:text-base font-medium group-hover:text-main-accent transition-colors">
                    to explore
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        id="main-hero"
        className="relative z-10       w-full mx-auto sm:-mt-16 lg:-mt-24 xl:-mt-28  px-4 sm:px-6 lg:px-8 text-center  "
      >
        <div className="  w-full   mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full border border-main-accent bg-[rgb(var(--color-surface-bg-rgb)/0.8)] backdrop-blur-sm">
            <span className="text-main-accent font-medium text-sm">
              100% FREE for Candidates
            </span>
          </div>

          {/* Headlines */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-main-text mb-6 font-title leading-tight">
            <span className="block">America Needs Builders.</span>
            <span className="block text-main-accent mt-2">
              Step Into the Future of
            </span>
            <span className="block text-main-accent">Skilled Trades.</span>
          </h1>

          {/* Subcopy */}
          <p className="text-lg sm:text-xl lg:text-2xl text-main-light-text mb-12 max-w-3xl mx-auto leading-relaxed">
            Find high-paying jobs that offer stability—without the burden of
            college debt.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="accent" size="lg" asChild>
              <Link
                href="/candidates"
                className="inline-flex items-center justify-center gap-2"
              >
                <span>Find Your Opportunity</span>
                <Icon icon="lucide:arrow-right" className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              icon="lucide:briefcase"
              iconPosition="left"
              asChild
            >
              <Link href="/employers">Post an Opening</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
      </div>
    </section>
  );
}
