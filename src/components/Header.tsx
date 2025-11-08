"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { useTheme } from "next-themes";

const navigation = [
  { name: "For Candidates", href: "/candidates" },
  { name: "For Employers", href: "/employers" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const logoSrc = theme === "light" ? "/logo.webp" : "/darkLogo.webp";

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-subtle">
      <nav
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logoSrc} alt="Guildustry" width={30} height={30} />
              <span className="text-2xl font-bold text-main-text font-display">
                Guildustry
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-main-text hover:bg-surface"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Icon
                icon={mobileMenuOpen ? "lucide:x" : "lucide:menu"}
                className="h-6 w-6"
              />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium leading-6 text-main-light-text hover:text-main-text transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
            <ThemeToggle />
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium leading-6 text-main-light-text hover:text-main-text transition-colors duration-200"
            >
              Sign In
            </Link>
            <Button variant="accent" size="sm" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-2 px-2 pb-3 pt-2 bg-surface border-t border-subtle">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-main-light-text hover:text-main-text hover:bg-main-bg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center gap-3 px-3 py-2">
                <ThemeToggle />
                <Link
                  href="/auth/sign-in"
                  className="text-base font-medium text-main-light-text hover:text-main-text transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Button variant="accent" size="sm" asChild>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
