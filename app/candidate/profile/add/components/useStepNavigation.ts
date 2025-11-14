import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  personalSchema,
  tradeSchema,
  resumeSchema,
  assessmentSchema,
  type ProfileFormValues,
} from "@/src/app/profile/schema";

const stepNames = ["Personal", "Trade", "Resume", "Assessment"];
const stepSchemas = [personalSchema, tradeSchema, resumeSchema, assessmentSchema];

interface UseStepNavigationReturn {
  current: number;
  goNext: () => Promise<void>;
  goBack: () => void;
}

export function useStepNavigation(
  methods: UseFormReturn<ProfileFormValues>,
  onFinalStep: () => Promise<void>
): UseStepNavigationReturn {
  const [current, setCurrent] = useState(0);

  const goNext = async () => {
    const currentStepName = stepNames[current];
    const stepResolver = stepSchemas[current];
    const data = methods.getValues();

    console.log(
      `[Profile] Step ${current + 1}/4: ${currentStepName} - Validating...`
    );
    console.log(`[Profile] Current step index: ${current}`);

    try {
      // Validate only the current step's fields
      stepResolver.parse(data);
      console.log(`[Profile] Step ${current + 1}/4: Validation passed`);

      // Clear any previous errors for this step
      methods.clearErrors();

      if (current < stepSchemas.length - 1) {
        const nextStep = current + 1;
        console.log(
          `[Profile] Moving from step ${current + 1} to step ${nextStep + 1}`
        );
        setCurrent(nextStep);
      } else {
        // Final step - save profile
        console.log("[Profile] Final step reached - saving profile");
        await onFinalStep();
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

  const goBack = () => {
    if (current > 0) {
      console.log(`[Profile] Going back to step ${current}/${stepSchemas.length}`);
      setCurrent(current - 1);
    }
  };

  return {
    current,
    goNext,
    goBack,
  };
}

