"use client";

import { useState, useEffect } from "react";
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
import { insertUserProfile, uploadResume } from "@/src/lib/profileFunctions";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

const steps = [
  { id: "personal", title: "Personal" },
  { id: "trade", title: "Trade" },
  { id: "resume", title: "Resume" },
  { id: "assessment", title: "Assessment" },
];

const stepNames = ["Personal", "Trade", "Resume", "Assessment"];
const stepSchemas = [
  personalSchema,
  tradeSchema,
  resumeSchema,
  assessmentSchema,
];

export default function AddProfilePage() {
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
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
      q1: undefined,
      q2: undefined,
    },
    mode: "onBlur", // Only validate when user leaves a field
  });

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

  const goNext = async () => {
    const currentStepName = stepNames[current];
    const stepResolver = stepSchemas[current];
    const data = methods.getValues();

    console.log(
      `[Profile] Step ${current + 1}/4: ${currentStepName} - Validating...`
    );

    try {
      // Validate only the current step's fields
      stepResolver.parse(data);
      console.log(`[Profile] Step ${current + 1}/4: Validation passed`);

      // Clear any previous errors for this step
      methods.clearErrors();

      if (current < steps.length - 1) {
        setCurrent(current + 1);
      } else {
        // Final step - save profile
        console.log("[Profile] Final step reached - saving profile");
        await handleSubmit();
      }
    } catch (e: any) {
      console.error(`[Profile] Step ${current + 1}/4: Validation failed`);

      // Manually set errors for the fields that failed validation
      if (e.errors) {
        e.errors.forEach((error: any) => {
          const fieldName = error.path[0];
          methods.setError(fieldName, {
            type: "manual",
            message: error.message,
          });
        });
      }

      // Trigger validation to show error messages
      await methods.trigger();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("[Profile] No user found");
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
        console.log("[Profile] Uploading resume file");
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

      await insertUserProfile(profileData);
      await refreshProfile();

      console.log("[Profile] Profile created - redirecting to view");
      alert("Profile created successfully!");
      router.push("/candidate/profile/view");
    } catch (error: any) {
      console.error("[Profile] Save error:", error.message);
      alert(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (current > 0) {
      console.log(`[Profile] Going back to step ${current}/${steps.length}`);
      setCurrent(current - 1);
    }
  };

  if (authLoading) {
    return <PageSkeleton variant="profile" />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-title font-bold">
            Create Your Profile
          </h1>
          <p className="mt-2 text-main-light-text">
            Complete your profile to showcase your skills and experience.
          </p>
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
                Creating your profile...
              </p>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
