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

export default function UserProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("guildustry_profile");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProfileData(data);
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg text-main-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-4 mb-4">
            <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm text-main-light-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-main-bg text-main-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-6 mb-6">
              <Icon icon="lucide:user-circle" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold mb-4">No Profile Found</h1>
            <p className="text-lg text-main-light-text mb-8">
              Create your profile to showcase your skills and experience.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="accent" onClick={() => router.push("/profile")}>
                Create Profile
              </Button>
              <Button variant="outline" onClick={() => router.push("/profile/edit")}>
                Edit Profile
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
            <h1 className="text-3xl sm:text-4xl font-title font-bold mb-2">My Profile</h1>
            <p className="text-main-light-text">View and manage your profile information.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push("/profile/edit")}>
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
            <p className="text-sm font-medium text-main-text mb-1">Profile Complete</p>
            <p className="text-xs text-main-light-text">
              Your profile is ready to be discovered by employers.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>
              <Icon icon="lucide:refresh-cw" className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
            <Button variant="accent" size="sm" onClick={() => router.push("/candidate/dashboard")}>
              <Icon icon="lucide:arrow-right" className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

