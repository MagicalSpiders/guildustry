"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";

export default function EmployerApplicantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Get user role from metadata (check user_type first, then role)
  const userRole = user?.user_metadata?.user_type || user?.user_metadata?.role;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (userRole !== "employer") {
      if (userRole === "candidate") {
        router.push("/candidate/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, userRole, loading, router]);

  if (loading || !isAuthenticated || userRole !== "employer") return null;

  return <>{children}</>;
}

