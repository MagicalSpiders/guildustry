"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import type { ProfileFormValues } from "@/src/app/profile/schema";
import { Button } from "@/src/components/Button";
import { PersonalInfo } from "./components/PersonalInfo";
import { TradeInfo } from "./components/TradeInfo";
import { ResumeInfo } from "./components/ResumeInfo";
import { AssessmentInfo } from "./components/AssessmentInfo";
import { useAuth } from "@/src/components/AuthProvider";
import { ProgressCard } from "@/app/candidate/dashboard/components/ProgressCard";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (profile) {
      // Convert profile to ProfileFormValues format
      setProfileData(profile as any);
    } else {
      setProfileData(null);
    }
  }, [profile]);

  if (authLoading) {
    return <PageSkeleton variant="profile" />;
  }

  // Show ProgressCard if no profile exists
  if (!profileData) {
    return (
      <div className="min-h-screen bg-main-bg text-main-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-title font-bold mb-2">
                Complete Your Profile
              </h1>
              <p className="text-main-light-text">
                Create your profile to showcase your skills and experience to
                employers.
              </p>
            </div>

            <ProgressCard
              steps={[
                {
                  title: "Step 1: Complete Profile & Assessment",
                  status: "pending",
                  href: "/candidate/profile",
                },
                {
                  title: "Step 2: Browse Job Openings",
                  status: "disabled",
                  subtitle: "Complete your profile first",
                },
                {
                  title: "Step 3: Explore Learning Hub & Resources",
                  status: "optional",
                  href: "/candidate/resources",
                },
              ]}
            />

            <div className="mt-6 text-center">
              <Button
                variant="accent"
                size="lg"
                onClick={() => router.push("/candidate/profile")}
              >
                <Icon icon="lucide:user-plus" className="w-5 h-5 mr-2" />
                Start Creating Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold mb-2">
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
              onClick={() => router.push("/candidate/profile")}
            >
              <Icon icon="lucide:edit" className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <PersonalInfo data={profileData} />

          {/* Trade & Experience */}
          <TradeInfo data={profileData} />

          {/* Resume */}
          <ResumeInfo data={profileData} />

          {/* Assessment */}
          <AssessmentInfo data={profileData} />
        </div>

        {/* Action Footer */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
          <div>
            <p className="text-sm font-medium text-main-text mb-1">
              Profile Complete
            </p>
            <p className="text-xs text-main-light-text">
              Your profile is ready to be discovered by employers.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/candidate/profile")}
            >
              <Icon icon="lucide:refresh-cw" className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => router.push("/candidate/dashboard")}
            >
              <Icon icon="lucide:arrow-right" className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
