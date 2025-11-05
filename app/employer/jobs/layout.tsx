"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";

export default function EmployerJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }
    if (user?.role !== "employer") {
      if (user?.role === "candidate") {
        router.push("/candidate/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "employer") return null;

  return <>{children}</>;
}

