"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/src/app/homepage/components/Hero";
import { Stats } from "@/src/app/homepage/components/Stats";
import { Employers } from "@/src/app/homepage/components/Employers";
import { Candidates } from "@/src/app/homepage/components/Candidates";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Handle email confirmation redirects from Supabase
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // Check if this is an email confirmation callback
    const params = new URLSearchParams(hash.substring(1));
    const error = params.get("error");
    const errorCode = params.get("error_code");
    const type = params.get("type");

    // If there's an email-related hash, redirect to auth page with the hash
    if ((error && errorCode) || type === "signup" || type === "recovery") {
      console.log(
        "📧 Email confirmation callback detected, redirecting to auth page"
      );
      // Redirect to auth page with the hash intact
      router.push(`/auth/sign-in${hash}`);
    }
  }, [router]);

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Redirect authenticated users to their dashboard
    if (isAuthenticated && user) {
      const userRole =
        user.user_metadata?.user_type || user.user_metadata?.role;
      console.log(
        "🏠 Homepage: User is authenticated, redirecting to dashboard",
        { userRole }
      );

      if (userRole === "employer") {
        router.push("/employer/dashboard");
      } else if (userRole === "candidate") {
        router.push("/candidate/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return <PageSkeleton variant="default" />;
  }

  // Don't render homepage if user is authenticated (they're being redirected)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
      <Employers />
      <Candidates />
    </div>
  );
}
