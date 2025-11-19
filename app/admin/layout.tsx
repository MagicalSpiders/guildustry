"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { AdminNav } from "./components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Get role from user metadata (where Supabase stores it)
  // Check user_type first (new), then role (backward compatibility)
  const userRole = user?.user_metadata?.user_type || user?.user_metadata?.role;

  useEffect(() => {
    // Wait for auth to load
    if (loading) {
      console.log("⏳ Admin Layout: Loading auth state...");
      return;
    }

    console.log("🔐 Admin Layout Check:", {
      isAuthenticated,
      userRole,
      user: user?.email,
    });

    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to sign-in");
      router.push("/auth/sign-in");
      return;
    }

    // Check if user is an admin
    if (userRole !== "admin") {
      console.log("⚠️ Not an admin, role is:", userRole);
      if (userRole === "candidate") {
        console.log("➡️ Redirecting candidate to /candidate/dashboard");
        router.push("/candidate/dashboard");
      } else if (userRole === "employer") {
        console.log("➡️ Redirecting employer to /employer/dashboard");
        router.push("/employer/dashboard");
      } else {
        console.log("➡️ Redirecting to /dashboard");
        router.push("/dashboard");
      }
    } else if (userRole === "admin") {
      console.log("✅ Admin verified, staying on /admin");
    }
  }, [isAuthenticated, userRole, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  // Don't render if not authenticated or not an admin
  if (!isAuthenticated || userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}

