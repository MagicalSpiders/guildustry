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


const steps = [
  { id: "personal", title: "Personal" },
  { id: "trade", title: "Trade" },
  { id: "resume", title: "Resume" },
  { id: "assessment", title: "Assessment" },
];

export default function ProfilePage() {
  const [current, setCurrent] = useState(0);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      primaryTrade: "",
      yearsExperience: 0,
      shiftPreference: "any",
      hasLicense: false,
      resumeFileName: "",
    },
    mode: "onChange",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("guildustry_profile");
    if (saved) {
      try {
        methods.reset(JSON.parse(saved));
      } catch {}
    }
  }, []); // eslint-disable-line

  const goNext = async () => {
    const stepResolver = [personalSchema, tradeSchema, resumeSchema, assessmentSchema][current];
    const data = methods.getValues();
    try {
      stepResolver.parse(data);
      if (current < steps.length - 1) setCurrent((c) => c + 1);
      else {
        // Save profile and redirect to showcase
        localStorage.setItem("guildustry_profile", JSON.stringify(data));
        window.location.href = "/profile/userprofile";
      }
    } catch (e) {
      // trigger field validation display
      await methods.trigger();
    }
  };

  const goBack = () => setCurrent((c) => Math.max(0, c - 1));

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
              canNext={true}
              isLast={current === steps.length - 1}
              onBack={goBack}
              onNext={goNext}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
