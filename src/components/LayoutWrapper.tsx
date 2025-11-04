"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DashboardNav } from "./DashboardNav";
import { useAuth } from "./AuthProvider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/candidate") ||
    pathname?.startsWith("/profile");

  // Show dashboard nav when authenticated
  if (isAuthenticated && isDashboardPage) {
    return (
      <>
        <DashboardNav />
        <main>{children}</main>
      </>
    );
  }

  // Show regular header/footer for non-auth pages
  if (!isAuthPage) {
    return (
      <>
        <Header />
        <main>{children}</main>
        <Footer />
      </>
    );
  }

  // Auth pages have no header/footer
  return <main>{children}</main>;
}

