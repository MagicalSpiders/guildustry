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
import { useProfileSubmission } from "./components/useProfileSubmission";
import { useStepNavigation } from "./components/useStepNavigation";
import { ProfileSubmissionModal } from "./components/ProfileSubmissionModal";
import { AddProfileHeader } from "./components/AddProfileHeader";
import { StepperForm } from "./components/StepperForm";

export default function AddProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

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

  // Custom hooks for submission and navigation
  const submission = useProfileSubmission(methods);
  const navigation = useStepNavigation(methods, submission.handleSubmit);

  // Pre-fill email from auth user
  useEffect(() => {
    if (!authLoading && user) {
      console.log("[Profile] Pre-filling email from auth");
      methods.setValue("email", user.email || "");
    }
  }, [authLoading, user, methods]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("[Flow] Not authenticated - redirecting to sign-in");
      router.push("/auth/sign-in");
    }
  }, [authLoading, user, router]);

  // If profile already exists, redirect to view
  useEffect(() => {
    if (!authLoading && profile) {
      console.log("[Flow] Profile already exists - redirecting to view");
      router.push("/candidate/profile/view");
    }
  }, [authLoading, profile, router]);

  if (authLoading) {
    return <PageSkeleton variant="profile" />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <AddProfileHeader />

        <StepperForm
          methods={methods}
          current={navigation.current}
          isSubmitting={submission.isSubmitting}
          onNext={navigation.goNext}
          onBack={navigation.goBack}
        />
      </div>

      <ProfileSubmissionModal
        open={submission.noticeOpen}
        title={submission.noticeTitle}
        description={submission.noticeDescription}
        variant={submission.noticeVariant}
        onClose={submission.closeNotice}
      />
    </div>
  );
}
