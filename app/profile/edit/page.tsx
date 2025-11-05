"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/src/app/profile/schema";
import { Button } from "@/src/components/Button";
import { PersonalFields } from "./components/PersonalFields";
import { TradeFields } from "./components/TradeFields";
import { ResumeField } from "./components/ResumeField";
import { AssessmentFields } from "./components/AssessmentFields";

export default function ProfileEditPage() {
  const router = useRouter();
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
      q1: undefined,
      q2: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const saved = localStorage.getItem("guildustry_profile");
    if (saved) {
      try {
        methods.reset(JSON.parse(saved));
      } catch {}
    }
  }, []); // eslint-disable-line

  const onSave = methods.handleSubmit((data) => {
    localStorage.setItem("guildustry_profile", JSON.stringify(data));
    router.push("/profile/userprofile");
  });

  const onCancel = () => router.push("/profile");

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold">
              Edit Profile
            </h1>
            <p className="mt-2 text-main-light-text">
              Update your information. Changes are saved locally for now.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={onSave}>
              Save Profile
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
            {/* Personal */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
              <h2 className="text-xl font-title font-bold mb-4">Personal</h2>
              <PersonalFields />
            </section>

            {/* Trade & Experience */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
              <h2 className="text-xl font-title font-bold mb-4">
                Trade & Experience
              </h2>
              <TradeFields />
            </section>

            {/* Resume */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated lg:col-span-2">
              <h2 className="text-xl font-title font-bold mb-4">Resume</h2>
              <ResumeField />
            </section>

            {/* Assessment */}
            <section className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated lg:col-span-2">
              <h2 className="text-xl font-title font-bold mb-4">Assessment</h2>
              <AssessmentFields />
            </section>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
