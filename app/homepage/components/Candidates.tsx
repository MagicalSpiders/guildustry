"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/src/components/Button";

export function Candidates() {
  return (
    <section className="bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 order-last lg:order-first">
            <div className="relative overflow-hidden rounded-2xl border border-subtle bg-surface p-6">
              {/* Decorative background */}
              <svg
                className="absolute -left-10 -top-10 h-40 w-40 opacity-10"
                viewBox="0 0 100 100"
                fill="none"
              >
                <rect
                  x="8"
                  y="8"
                  width="84"
                  height="84"
                  rx="12"
                  stroke="currentColor"
                  className="text-main-accent"
                  strokeWidth="2"
                />
                <path
                  d="M25 65 L40 50 L52 62 L75 40"
                  stroke="currentColor"
                  className="text-main-accent"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* Mini summary header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-main-light-text opacity-70">
                    Your journey
                  </p>
                  <p className="text-lg font-semibold text-main-text">
                    Next steps to get hired
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-subtle px-2 py-1 text-xs text-main-light-text">
                  <Icon
                    icon="lucide:heart"
                    className="w-4 h-4 text-main-accent"
                  />
                  Support
                </span>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg bg-surface p-3 border border-subtle">
                  <div className="text-xl font-bold font-title text-main-text">
                    1
                  </div>
                  <p className="text-xs text-main-light-text">Apply</p>
                </div>
                <div className="rounded-lg bg-surface p-3 border border-subtle">
                  <div className="text-xl font-bold font-title text-main-text">
                    2
                  </div>
                  <p className="text-xs text-main-light-text">Interview</p>
                </div>
                <div className="rounded-lg bg-surface p-3 border border-subtle">
                  <div className="text-xl font-bold font-title text-main-accent">
                    3
                  </div>
                  <p className="text-xs text-main-light-text">Start</p>
                </div>
              </div>

              {/* Benefit chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-main-light-text">
                <div className="flex items-center gap-2 rounded-lg bg-surface border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:hammer"
                    className="w-5 h-5 text-main-accent"
                  />
                  Apprenticeships
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:badge-dollar-sign"
                    className="w-5 h-5 text-main-accent"
                  />
                  Great pay
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:school"
                    className="w-5 h-5 text-main-accent"
                  />
                  No degree
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:calendar-clock"
                    className="w-5 h-5 text-main-accent"
                  />
                  Start today
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-main-light-text opacity-70">
                  <Icon
                    icon="lucide:stars"
                    className="w-4 h-4 text-main-accent"
                  />
                  Resume help available
                </div>
                <span className="text-xs text-main-light-text opacity-70">
                  Always free
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-sm tracking-wide uppercase text-main-light-text opacity-70">
              <Icon
                icon="lucide:user-round"
                className="w-4 h-4 text-main-accent"
              />
              For Candidates
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-title font-bold text-main-text">
              Browse vetted openings, no degree required, start earning today.
            </h2>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-main-light-text">
              <li className="flex items-center gap-2">
                <Icon
                  icon="lucide:search-check"
                  className="w-5 h-5 text-main-accent"
                />
                Browse vetted openings
              </li>
              <li className="flex items-center gap-2">
                <Icon
                  icon="lucide:graduation-cap"
                  className="w-5 h-5 text-main-accent"
                />
                No degree required
              </li>
              <li className="flex items-center gap-2">
                <Icon
                  icon="lucide:wallet"
                  className="w-5 h-5 text-main-accent"
                />
                Start earning today
              </li>
            </ul>
            <div className="mt-8">
              <Button variant="outline" size="md" asChild>
                <Link
                  href="/candidates"
                  className="inline-flex items-center gap-2"
                >
                  <span>Apply Now</span>
                  <Icon icon="lucide:send" className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
