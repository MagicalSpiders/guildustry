"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { PersonalFields } from "./PersonalFields";
import { TradeFields } from "./TradeFields";
import { ResumeField } from "./ResumeField";
import { AssessmentFields } from "./AssessmentFields";
import type { ProfileFormValues } from "@/src/app/profile/schema";

interface EditProfileFormProps {
  methods: UseFormReturn<ProfileFormValues>;
  onSubmit: () => void;
}

export function EditProfileForm({ methods, onSubmit }: EditProfileFormProps) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
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
  );
}

