"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/src/components/Button";

export function Employers() {
  return (
    <section className="bg-surface text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-sm tracking-wide uppercase text-main-light-text opacity-70">
              <Icon
                icon="lucide:briefcase"
                className="w-4 h-4 text-main-accent"
              />
              For Employers
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-title font-bold">
              Reach motivated talent ready to work. Fill jobs fast.
            </h2>
            <p className="mt-4 text-main-light-text">
              Build your skilled workforce — 100% FREE. Post openings and
              connect with vetted tradespeople quickly.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-main-light-text">
              <li className="flex items-center gap-2">
                <Icon
                  icon="lucide:target"
                  className="w-5 h-5 text-main-accent"
                />
                Reach motivated talent
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:zap" className="w-5 h-5 text-main-accent" />
                Fill jobs fast
              </li>
              <li className="flex items-center gap-2">
                <Icon
                  icon="lucide:shield-check"
                  className="w-5 h-5 text-main-accent"
                />
                Vetted candidates
              </li>
              <li className="flex items-center gap-2">
                <Icon
                  icon="lucide:dollar-sign"
                  className="w-5 h-5 text-main-accent"
                />
                Zero cost to start
              </li>
            </ul>

            <div className="mt-8">
              <Button variant="accent" size="md" asChild>
                <Link
                  href="/employers"
                  className="inline-flex items-center gap-2"
                >
                  <span>Start Hiring</span>
                  <Icon icon="lucide:arrow-right" className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-subtle bg-main-bg p-6">
              {/* Decorative background */}
              <svg
                className="absolute -right-10 -top-10 h-40 w-40 opacity-10"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="currentColor"
                  className="text-main-accent"
                  strokeWidth="2"
                />
                <path
                  d="M20 60 L45 35 L62 52 L82 30"
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
                    Pipeline overview
                  </p>
                  <p className="text-lg font-semibold text-main-text">
                    Open roles this week
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-subtle px-2 py-1 text-xs text-main-light-text">
                  <Icon
                    icon="lucide:sparkles"
                    className="w-4 h-4 text-main-accent"
                  />
                  Priority
                </span>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg bg-surface p-3 border border-subtle">
                  <div className="text-xl font-bold font-title">28</div>
                  <p className="text-xs text-main-light-text">Applicants</p>
                </div>
                <div className="rounded-lg bg-surface p-3 border border-subtle">
                  <div className="text-xl font-bold font-title">12</div>
                  <p className="text-xs text-main-light-text">Interviews</p>
                </div>
                <div className="rounded-lg bg-surface p-3 border border-subtle">
                  <div className="text-xl font-bold font-title text-main-accent">
                    3
                  </div>
                  <p className="text-xs text-main-light-text">Offers</p>
                </div>
              </div>

              {/* Industry chips */}
              <div className="grid grid-cols-2 gap-3 text-sm text-main-light-text">
                <div className="flex items-center gap-2 rounded-lg bg-surface/60 border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:hard-hat"
                    className="w-5 h-5 text-main-accent"
                  />
                  Construction
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface/60 border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:wrench"
                    className="w-5 h-5 text-main-accent"
                  />
                  HVAC
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface/60 border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:bolt"
                    className="w-5 h-5 text-main-accent"
                  />
                  Electrical
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface/60 border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:factory"
                    className="w-5 h-5 text-main-accent"
                  />
                  Manufacturing
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface/60 border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:flame"
                    className="w-5 h-5 text-main-accent"
                  />
                  Welding
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface/60 border border-subtle px-3 py-2">
                  <Icon
                    icon="lucide:truck"
                    className="w-5 h-5 text-main-accent"
                  />
                  Logistics
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-main-light-text opacity-70">
                  <Icon
                    icon="lucide:shield-check"
                    className="w-4 h-4 text-main-accent"
                  />
                  Vetted profiles, updated daily
                </div>
                <span className="text-xs text-main-light-text opacity-70">
                  100% FREE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
