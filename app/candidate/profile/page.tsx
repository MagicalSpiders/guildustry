"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

/**
 * Profile Router Page
 * Checks if user has a profile and routes accordingly:
 * - Has profile → /candidate/profile/view
 * - No profile → /candidate/profile/add
 */
export default function ProfileRouterPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      console.log("[Flow] Not authenticated - redirecting to sign-in");
      router.push("/auth/sign-in");
      return;
    }

    if (profile) {
      console.log("[Flow] Profile exists - redirecting to view");
      router.push("/candidate/profile/view");
    } else {
      console.log("[Flow] No profile - redirecting to add");
      router.push("/candidate/profile/add");
    }
  }, [user, profile, loading, router]);

  return <PageSkeleton variant="profile" />;
}
