"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function EmployerDashboardLayout({
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
      console.log("⏳ Employer Layout: Loading auth state...");
      return;
    }

    console.log("🏢 Employer Layout Check:", {
      isAuthenticated,
      userRole,
      user: user?.email,
    });

    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to sign-in");
      router.push("/auth/sign-in");
      return;
    }

    // Check if user is an employer
    if (userRole && userRole !== "employer") {
      console.log("⚠️ Not an employer, role is:", userRole);
      if (userRole === "candidate") {
        console.log("➡️ Redirecting candidate to /candidate/dashboard");
        router.push("/candidate/dashboard");
      } else {
        console.log("➡️ Redirecting to /dashboard");
        router.push("/dashboard");
      }
    } else if (userRole === "employer") {
      console.log("✅ Employer verified, staying on /employer/dashboard");
    }
  }, [isAuthenticated, userRole, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  // Don't render if not authenticated or not an employer
  if (!isAuthenticated || (userRole && userRole !== "employer")) {
    return null;
  }

  return <>{children}</>;
}
