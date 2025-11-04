import Link from "next/link";
import { Icon } from "@iconify/react";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-subtle text-main-light-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand / About */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-title font-bold text-main-text">
                Guildustry
              </span>
              <span className="inline-flex items-center justify-center rounded-md bg-main-accent/15 text-main-accent px-2 py-0.5 text-xs">
                Since 2025
              </span>
            </div>
            <p className="mt-4 max-w-xl leading-relaxed">
              Modern platform connecting skilled trades talent with employers.
              Building careers that honor craft, deliver stability, and create
              futures.
            </p>
            <div className="mt-6 flex items-center gap-3 text-neutral-400 dark:text-neutral-500">
              <Icon
                icon="lucide:shield-check"
                className="w-5 h-5 text-main-accent"
              />
              <span className="text-sm">Secure & privacy‑first</span>
            </div>
          </div>

          {/* For Candidates */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              For Candidates
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-main-accent transition-colors"
                >
                  Why Skilled Trades
                </Link>
              </li>
              <li>
                <Link
                  href="/candidates"
                  className="hover:text-main-accent transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-main-accent transition-colors"
                >
                  Training Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-main-accent transition-colors"
                >
                  Career Guidance
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              For Employers
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/employers"
                  className="hover:text-main-accent transition-colors"
                >
                  Why Guildustry
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-main-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-main-accent transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-main-accent transition-colors"
                >
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-neutral-400 dark:text-neutral-500">
              © 2025 Guildustry. All rights reserved.
            </p>
            <p className="text-neutral-400 dark:text-neutral-500">
              Designed and Built By{" "}
              <a href="#" className="text-main-accent hover:underline">
                AppBox Agency Australia
              </a>
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-main-accent">
              Privacy Policy
            </Link>
            <span className="text-neutral-500 dark:text-neutral-400">/</span>
            <Link href="/terms" className="hover:text-main-accent">
              Terms of Service
            </Link>
            <span className="text-neutral-500 dark:text-neutral-400">/</span>
            <Link href="/contact" className="hover:text-main-accent">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
