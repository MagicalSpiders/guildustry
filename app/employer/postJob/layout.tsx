"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function PostJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/sign-in");
        return;
      }

      const userRole =
        user?.user_metadata?.user_type || user?.user_metadata?.role;

      if (userRole !== "employer") {
        router.push("/dashboard");
        return;
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  return <>{children}</>;
}

