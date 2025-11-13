"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/src/app/profile/schema";
import { Button } from "@/src/components/Button";
import { PersonalFields } from "@/app/candidate/profile/edit/components/PersonalFields";
import { TradeFields } from "@/app/candidate/profile/edit/components/TradeFields";
import { ResumeField } from "@/app/candidate/profile/edit/components/ResumeField";
import { AssessmentFields } from "@/app/candidate/profile/edit/components/AssessmentFields";
import { useAuth } from "@/src/components/AuthProvider";
import { updateUserProfile, uploadResume } from "@/src/lib/profileFunctions";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      q1: undefined,
      q2: undefined,
    },
    mode: "onBlur", // Only validate when user leaves a field
  });

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
        q1: undefined,
        q2: undefined,
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

  const onSave = methods.handleSubmit(async (data) => {
    if (!user) {
      console.error("[Profile] No user found");
      alert("You must be logged in to save your profile");
      router.push("/auth/sign-in");
      return;
    }

    console.log("[Profile] Saving profile updates");
    setIsSubmitting(true);
    try {
      // Handle resume file upload if present
      let resumeUrl = data.resume_file_url;
      const resumeFile = (data as any).resumeFile as File | undefined;
      
      if (resumeFile) {
        console.log("[Profile] Uploading new resume file");
        resumeUrl = await uploadResume(resumeFile, user.id);
      }

      const profileData = {
        fullname: data.fullname,
        email: data.email,
        phone_number: data.phone_number,
        city: data.city,
        state: data.state,
        primary_trade: data.primary_trade,
        years_of_experience: data.years_of_experience,
        shift_preference: data.shift_preference,
        has_valid_licence: data.has_valid_licence || false,
        resume_file_url: resumeUrl,
        role: data.role || "candidate",
        priority: data.priority || 1,
        company_id: data.company_id || null,
      };

      await updateUserProfile(profileData);
      await refreshProfile();
      
      console.log("[Profile] Profile updated - redirecting to view");
      alert("Profile updated successfully!");
      router.push("/candidate/profile/view");
    } catch (error: any) {
      console.error("[Profile] Update error:", error.message);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  const onCancel = () => {
    console.log("[Flow] Edit cancelled - returning to view");
    router.push("/candidate/profile/view");
  };

  if (authLoading) {
    return <PageSkeleton variant="profile" />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold">
              Edit Profile
            </h1>
            <p className="mt-2 text-main-light-text">
              Update your profile information and preferences.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={onSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Personal Information */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
              <h2 className="text-xl font-title font-bold mb-4 text-main-text">
                Personal Information
              </h2>
              <PersonalFields />
            </section>

            {/* Trade & Experience */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
              <h2 className="text-xl font-title font-bold mb-4 text-main-text">
                Trade & Experience
              </h2>
              <TradeFields />
            </section>

            {/* Resume */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated lg:col-span-2">
              <h2 className="text-xl font-title font-bold mb-4 text-main-text">
                Resume
              </h2>
              <ResumeField />
            </section>

            {/* Assessment */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated lg:col-span-2">
              <h2 className="text-xl font-title font-bold mb-4 text-main-text">
                Assessment
              </h2>
              <AssessmentFields />
            </section>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
