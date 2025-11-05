"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "lucide:user" },
  { name: "Jobs", href: "/dashboard/jobs", icon: "gravity-ui:magnifier" },
  { name: "Applicants", href: "/candidate/applications", icon: "lucide:users" },
  { name: "Company", href: "/dashboard/company", icon: "lucide:building-2" },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: "lucide:bell",
  },
  { name: "Profile", href: "/profile", icon: "lucide:id-card" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const getDashboardHref = () => {
    if (user?.role === "candidate") {
      return "/candidate/dashboard";
    } else if (user?.role === "employer") {
      return "/employer/dashboard";
    }
    return "/dashboard";
  };

  const getApplicantsHref = () => {
    return user?.role === "candidate"
      ? "/candidate/applications"
      : "/dashboard/applicants";
  };

  const handleLogout = () => {
    logout();
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
            <Link href={getDashboardHref()} className="flex items-center gap-2">
              <Image src="/logo.webp" alt="Guildustry" width={30} height={30} />
              <span className="text-2xl font-bold text-main-text font-display">
                Guildustry
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => {
              // For Dashboard and Applicants links, use dynamic href based on user role
              let href = item.href;
              if (item.name === "Dashboard") {
                href = getDashboardHref();
              } else if (item.name === "Applicants") {
                href = getApplicantsHref();
              }

              // Check if current path matches the href or any of the role-specific paths
              const isActive =
                pathname === href ||
                (item.name === "Dashboard" &&
                  (pathname === "/dashboard" ||
                    pathname === "/candidate/dashboard" ||
                    pathname === "/employer/dashboard")) ||
                (item.name === "Applicants" &&
                  (pathname === "/candidate/applications" ||
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
