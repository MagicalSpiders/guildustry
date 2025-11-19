"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/src/components/AuthProvider";

export function AdminNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "lucide:layout-dashboard" },
    { href: "/admin/users", label: "Users", icon: "lucide:users" },
    { href: "/admin/jobs", label: "Jobs", icon: "lucide:briefcase" },
    { href: "/admin/applications", label: "Applications", icon: "lucide:file-text" },
    { href: "/admin/content", label: "Content", icon: "lucide:file-edit" },
  ];

  return (
    <nav className="border-b border-subtle bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-title text-xl font-semibold text-main-text"
            >
              <Icon icon="lucide:shield-check" className="h-6 w-6 text-main-accent" />
              Admin Portal
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-main-accent/10 text-main-accent"
                        : "text-main-light-text hover:text-main-text hover:bg-light-bg"
                    }`}
                  >
                    <Icon icon={item.icon} className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-main-light-text hover:text-main-text hover:bg-light-bg transition-colors"
          >
            <Icon icon="lucide:log-out" className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

