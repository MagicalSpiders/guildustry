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
    <div className="min-h-screen bg-gradient-to-br from-main-bg via-main-bg to-surface/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-main-accent rounded-full"></div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold text-main-text">
                  My Profile
                </h1>
              </div>
              <p className="text-lg text-main-light-text max-w-md">
                Your professional journey and skills presented elegantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push("/candidate/dashboard")}
                className="border-subtle hover:border-main-accent/50 hover:bg-surface/50 transition-all duration-200"
              >
                <Icon icon="lucide:arrow-left" className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={() => router.push("/candidate/profile/edit")}
                className="shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Icon icon="lucide:edit-3" className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Personal Information */}
          <div className="transform hover:scale-[1.01] transition-transform duration-200">
            <PersonalInfo data={profile as any} />
          </div>

          {/* Trade & Experience */}
          <div className="transform hover:scale-[1.01] transition-transform duration-200">
            <TradeInfo data={profile as any} />
          </div>

          {/* Resume */}
          <div className="transform hover:scale-[1.01] transition-transform duration-200 xl:col-span-2">
            <ResumeInfo data={profile as any} />
          </div>

          {/* Assessment */}
          <div className="transform hover:scale-[1.01] transition-transform duration-200 xl:col-span-2">
            <AssessmentInfo data={profile as any} />
          </div>
        </div>

        {/* Profile Status & Actions */}
        <div className="relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-r from-surface via-surface to-surface/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-main-accent/5 via-transparent to-main-accent/5 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 shadow-sm">
                  <Icon icon="lucide:check-circle-2" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-main-text mb-1">
                    Profile Complete
                  </h3>
                  <p className="text-main-light-text leading-relaxed">
                    Your profile is optimized and ready to attract employers. Keep it updated to stay competitive.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => router.push("/candidate/jobs")}
                  className="border-subtle hover:border-main-accent/50 hover:bg-surface/50 transition-all duration-200"
                >
                  <Icon icon="lucide:briefcase" className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => router.push("/candidate/dashboard")}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Icon icon="lucide:layout-dashboard" className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

