"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { PersonalInfo } from "@/app/candidate/profile/userprofile/components/PersonalInfo";
import { TradeInfo } from "@/app/candidate/profile/userprofile/components/TradeInfo";
import { ResumeInfo } from "@/app/candidate/profile/userprofile/components/ResumeInfo";
import { AssessmentInfo } from "@/app/candidate/profile/userprofile/components/AssessmentInfo";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function ViewProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("[Flow] Not authenticated - redirecting to sign-in");
      router.push("/auth/sign-in");
    }
  }, [authLoading, user, router]);

  // Redirect if no profile exists
  useEffect(() => {
    if (!authLoading && !profile) {
      console.log("[Flow] No profile found - redirecting to add");
      router.push("/candidate/profile/add");
    }
  }, [authLoading, profile, router]);

  if (authLoading) {
    return <PageSkeleton variant="profile" />;
  }

  if (!profile) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
              My Profile
            </h1>
            <p className="text-main-light-text">
              View and manage your profile information.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/candidate/dashboard")}
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => router.push("/candidate/profile/edit")}
            >
              <Icon icon="lucide:edit" className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <PersonalInfo data={profile as any} />

          {/* Trade & Experience */}
          <TradeInfo data={profile as any} />

          {/* Resume */}
          <ResumeInfo data={profile as any} />

          {/* Assessment */}
          <AssessmentInfo data={profile as any} />
        </div>

        {/* Profile Status Footer */}
        <div className="mt-8 rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-green-500" />
                <p className="text-sm font-medium text-main-text">Profile Complete</p>
              </div>
              <p className="text-xs text-main-light-text">
                Your profile is ready to be discovered by employers.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/candidate/jobs")}
              >
                <Icon icon="lucide:briefcase" className="w-4 h-4 mr-2" />
                Browse Jobs
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => router.push("/candidate/dashboard")}
              >
                <Icon icon="lucide:layout-dashboard" className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

