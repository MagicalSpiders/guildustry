"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/src/app/profile/schema";
import { useAuth } from "@/src/components/AuthProvider";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { useProfileUpdate } from "./components/useProfileUpdate";
import { ProfileUpdateModal } from "./components/ProfileUpdateModal";
import { EditProfileHeader } from "./components/EditProfileHeader";
import { EditProfileForm } from "./components/EditProfileForm";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullname: "",
      email: "",
      phone_number: "",
      city: "",
      state: "",
      primary_trade: "",
      years_of_experience: 0,
      shift_preference: "any",
      has_valid_licence: false,
      resume_file_url: null,
      role: "candidate",
      priority: 1,
      priority_choice: undefined as
        | "Safety first"
        | "Deliver on time"
        | "Control costs"
        | undefined,
      shape_choice: undefined as "Cylinder" | "Sphere" | "Torus" | undefined,
    },
    mode: "onBlur",
  });

  // Custom hook for profile update
  const update = useProfileUpdate(methods);

  // Load existing profile
  useEffect(() => {
    if (!authLoading && profile) {
      console.log("[Profile] Loading existing profile data");
      methods.reset({
        fullname: profile.fullname,
        email: profile.email,
        phone_number: profile.phone_number,
        city: profile.city,
        state: profile.state,
        primary_trade: profile.primary_trade,
        years_of_experience: profile.years_of_experience,
        shift_preference: profile.shift_preference as "any" | "day" | "night",
        has_valid_licence: profile.has_valid_licence,
        resume_file_url: profile.resume_file_url,
        role: profile.role as "candidate" | "employer",
        priority: profile.priority,
        priority_choice: (profile as any).priority_choice as
          | "Safety first"
          | "Deliver on time"
          | "Control costs"
          | undefined,
        shape_choice: (profile as any).shape_choice as
          | "Cylinder"
          | "Sphere"
          | "Torus"
          | undefined,
      });
    } else if (!authLoading && user) {
      methods.setValue("email", user.email || "");
    }
  }, [authLoading, profile, user, methods]);

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

  const onCancel = () => {
    console.log("[Flow] Edit cancelled - returning to view");
    router.push("/candidate/profile/view");
  };

  const onSave = methods.handleSubmit(async (data) => {
    await update.handleSave();
  });

  if (authLoading) {
    return <PageSkeleton variant="profile" />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <EditProfileHeader
          onCancel={onCancel}
          onSave={onSave}
          isSubmitting={update.isSubmitting}
        />

        <EditProfileForm methods={methods} onSubmit={onSave} />
      </div>

      <ProfileUpdateModal
        open={update.noticeOpen}
        title={update.noticeTitle}
        description={update.noticeDescription}
        variant={update.noticeVariant}
        onClose={update.closeNotice}
      />
    </div>
  );
}
