"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, profile, loading } = useAuth();
  const router = useRouter();

  // Get role from profile or user metadata
  const userRole = profile?.role || user?.user_metadata?.user_type || user?.user_metadata?.role;

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    // Check if user is a candidate
    if (userRole && userRole !== "candidate") {
      // Redirect employer to their dashboard
      router.push("/employer/dashboard");
    }
  }, [isAuthenticated, userRole, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  // Don't render if not authenticated or not a candidate
  if (!isAuthenticated || (userRole && userRole !== "candidate")) {
    return null;
  }

  return <>{children}</>;
}
