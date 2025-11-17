"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { getCompanyByOwner } from "@/src/lib/companyFunctions";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

/**
 * Profile Router Page
 * Checks if user has a company and routes accordingly:
 * - Has company → /employer/profile/view
 * - No company → /employer/profile/setup
 */
export default function ProfileRouterPage() {
  const router = useRouter();
  const { user, company, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      console.log("[Flow] Not authenticated - redirecting to sign-in");
      router.push("/auth/sign-in");
      return;
    }

    // Check if company exists
    const checkCompany = async () => {
      try {
        let companyData = company;

        if (!companyData) {
          companyData = await getCompanyByOwner();
        }

        if (companyData) {
          console.log("[Flow] Company exists - redirecting to view");
          router.push("/employer/profile/view");
        } else {
          console.log("[Flow] No company - redirecting to setup");
          router.push("/employer/profile/setup");
        }
      } catch (error: any) {
        console.error("[Flow] Error checking company:", error.message);
        // On error, redirect to setup
        router.push("/employer/profile/setup");
      }
    };

    checkCompany();
  }, [user, company, loading, router]);

  return <PageSkeleton variant="profile" />;
}
