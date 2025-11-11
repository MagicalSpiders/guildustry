"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import { useTheme } from "next-themes";
import {
  getDashboardRoute,
  getJobsRoute,
  getApplicantsRoute,
  getProfileRoute,
  getNotificationsRoute,
  type UserRole,
} from "@/src/lib/routes";

const navigation: Array<{
  name: string;
  href: string;
  icon: string;
  employerOnly?: boolean;
  candidateOnly?: boolean;
}> = [
  { name: "Dashboard", href: "/dashboard", icon: "lucide:layout-dashboard" },
  { name: "Jobs", href: "/dashboard/jobs", icon: "gravity-ui:magnifier" },
  {
    name: "Resources",
    href: "/candidate/resources",
    icon: "lucide:book-open",
    candidateOnly: true,
  },
  { name: "Applicants", href: "/candidate/applications", icon: "lucide:users" },
  {
    name: "Company",
    href: "/employer/profile",
    icon: "lucide:building-2",
    employerOnly: true,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: "lucide:bell",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "lucide:id-card",
    candidateOnly: true,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { signOut, user, profile } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark logo until theme is determined to prevent hydration mismatch
  const logoSrc =
    mounted && theme === "light" ? "/logo.webp" : "/darkLogo.webp";

  // Get role from profile (source of truth) or fallback to user metadata
  const userRole: UserRole =
    (profile?.role as UserRole) || (user?.user_metadata?.role as UserRole);

  const handleLogout = () => {
    signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-subtle">
      <nav
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Dashboard"
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link
              href={getDashboardRoute(userRole)}
              className="flex items-center gap-2"
            >
              <Image src={logoSrc} alt="Guildustry" width={30} height={30} />
              <span className="text-2xl font-bold text-main-text font-display">
                Guildustry
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => {
              // Hide Company link if user is not an employer
              if (item.employerOnly && userRole !== "employer") {
                return null;
              }

              // Hide Profile link if user is not a candidate
              if (item.candidateOnly && userRole !== "candidate") {
                return null;
              }

              // For Dashboard, Jobs, Applicants, Profile, and Notifications links, use dynamic href based on user role
              let href = item.href;
              if (item.name === "Dashboard") {
                href = getDashboardRoute(userRole);
              } else if (item.name === "Jobs") {
                href = getJobsRoute(userRole);
              } else if (item.name === "Applicants") {
                href = getApplicantsRoute(userRole);
              } else if (item.name === "Profile") {
                href = getProfileRoute(userRole);
              } else if (item.name === "Notifications") {
                href = getNotificationsRoute(userRole);
              }

              // Check if current path matches the href or any of the role-specific paths
              const isActive =
                pathname === href ||
                (item.name === "Dashboard" &&
                  (pathname === "/dashboard" ||
                    pathname === "/candidate/dashboard" ||
                    pathname === "/employer/dashboard")) ||
                (item.name === "Jobs" &&
                  (pathname === "/candidate/jobs" ||
                    pathname === "/dashboard/jobs" ||
                    pathname === "/employer/jobs")) ||
                (item.name === "Resources" &&
                  pathname === "/candidate/resources") ||
                (item.name === "Company" && pathname === "/employer/profile") ||
                (item.name === "Profile" &&
                  (pathname === "/candidate/profile" ||
                    pathname === "/employer/profile" ||
                    pathname === "/profile")) ||
                (item.name === "Notifications" &&
                  (pathname === "/employer/notifications" ||
                    pathname === "/dashboard/notifications")) ||
                (item.name === "Applicants" &&
                  (pathname === "/candidate/applications" ||
                    pathname === "/employer/applicants" ||
                    pathname === "/dashboard/applicants"));
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`text-sm font-medium leading-6 transition-colors duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-main-text"
                      : "text-main-light-text hover:text-main-text"
                  }`}
                >
                  <Icon icon={item.icon} className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
