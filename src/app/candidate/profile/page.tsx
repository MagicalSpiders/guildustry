"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  personalSchema,
  tradeSchema,
  resumeSchema,
  assessmentSchema,
  type ProfileFormValues,
} from "@/src/app/profile/schema";
import { Stepper } from "@/src/app/profile/components/Stepper";
import { StepControls } from "@/src/app/profile/components/StepControls";
import { PersonalStep } from "@/src/app/profile/steps/Personal";
import { TradeStep } from "@/src/app/profile/steps/Trade";
import { ResumeStep } from "@/src/app/profile/steps/Resume";
import { AssessmentStep } from "@/src/app/profile/steps/Assessment";
import { useAuth } from "@/src/components/AuthProvider";
import { insertUserProfile, updateUserProfile, uploadResume } from "@/src/lib/profileFunctions";
import { useRouter } from "next/navigation";


const steps = [
  { id: "personal", title: "Personal" },
  { id: "trade", title: "Trade" },
  { id: "resume", title: "Resume" },
  { id: "assessment", title: "Assessment" },
];

export default function ProfilePage() {
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    },
    mode: "onChange",
  });

  // Load existing profile if available
  useEffect(() => {
    if (!authLoading && profile) {
      methods.reset({
        fullname: profile.fullname,
        email: profile.email,
        phone_number: profile.phone_number,
        city: profile.city,
        state: profile.state,
        primary_trade: profile.primary_trade,
        years_of_experience: profile.years_of_experience,
        shift_preference: profile.shift_preference,
        has_valid_licence: profile.has_valid_licence,
        resume_file_url: profile.resume_file_url,
        role: profile.role as "candidate" | "employer",
        priority: profile.priority,
      });
    } else if (!authLoading && user) {
      // Pre-fill email from auth user
      methods.setValue("email", user.email || "");
    }
  }, [authLoading, profile, user]); // eslint-disable-line

  const goNext = async () => {
    const stepResolver = [personalSchema, tradeSchema, resumeSchema, assessmentSchema][current];
    const data = methods.getValues();
    try {
      stepResolver.parse(data);
      if (current < steps.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        // Final step - save profile to Supabase
        await handleSubmit();
      }
    } catch (e) {
      // trigger field validation display
      await methods.trigger();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to save your profile");
      router.push("/auth/sign-in");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = methods.getValues();
      
      // Handle resume file upload if present
      let resumeUrl = data.resume_file_url;
      const resumeFile = (data as any).resumeFile as File | undefined;
      
      if (resumeFile) {
        resumeUrl = await uploadResume(resumeFile, user.id);
      }

      const profileData = {
        id: user.id,
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
        created_by: user.id,
        role: data.role || "candidate",
        priority: data.priority || 1,
        company_id: data.company_id || null,
      };

      if (profile) {
        // Update existing profile
        await updateUserProfile(profileData);
      } else {
        // Create new profile
        await insertUserProfile(profileData);
      }

      alert("Profile saved successfully!");
      router.push("/candidate/profile/userprofile");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => setCurrent((c) => Math.max(0, c - 1));

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/sign-in");
    }
  }, [authLoading, user, router]);

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-title font-bold">Profile Settings</h1>
          <p className="mt-2 text-main-light-text">Manage your profile information and preferences.</p>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <Stepper steps={steps} current={current} />
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goNext();
            }}
            className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated"
          >
            {current === 0 && <PersonalStep />}
            {current === 1 && <TradeStep />}
            {current === 2 && <ResumeStep />}
            {current === 3 && <AssessmentStep />}

            <StepControls
              canBack={current > 0}
              canNext={!isSubmitting}
              isLast={current === steps.length - 1}
              onBack={goBack}
              onNext={goNext}
            />
            {isSubmitting && (
              <p className="mt-4 text-center text-sm text-main-light-text">
                Saving your profile...
              </p>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
