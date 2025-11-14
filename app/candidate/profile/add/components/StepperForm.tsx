"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { Stepper } from "@/src/app/profile/components/Stepper";
import { StepControls } from "@/src/app/profile/components/StepControls";
import { PersonalStep } from "@/src/app/profile/steps/Personal";
import { TradeStep } from "@/src/app/profile/steps/Trade";
import { ResumeStep } from "@/src/app/profile/steps/Resume";
import { AssessmentStep } from "@/src/app/profile/steps/Assessment";
import type { ProfileFormValues } from "@/src/app/profile/schema";

const steps = [
  { id: "personal", title: "Personal" },
  { id: "trade", title: "Trade" },
  { id: "resume", title: "Resume" },
  { id: "assessment", title: "Assessment" },
];

interface StepperFormProps {
  methods: UseFormReturn<ProfileFormValues>;
  current: number;
  isSubmitting: boolean;
  onNext: () => Promise<void>;
  onBack: () => void;
}

export function StepperForm({
  methods,
  current,
  isSubmitting,
  onNext,
  onBack,
}: StepperFormProps) {
  return (
    <>
      {/* Stepper */}
      <div className="mb-6">
        <Stepper steps={steps} current={current} />
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
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
            onBack={onBack}
            onNext={onNext}
          />
        </form>
      </FormProvider>
    </>
  );
}
