"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/components/AuthProvider";
import { insertJob } from "@/src/lib/jobsFunctions";
import { NoticeModal } from "@/src/components/NoticeModal";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { Stepper, type StepperStep } from "@/src/components/Stepper";
import { RoleBasicsStep } from "./components/RoleBasicsStep";
import { RequirementsStep } from "./components/RequirementsStep";
import { PreferencesStep } from "./components/PreferencesStep";
import { DescriptionStep } from "./components/DescriptionStep";

// Form validation schema
const jobFormSchema = z.object({
  // Step 1: Role Basics
  title: z.string().min(1, "Job title is required"),
  trade_specialty: z.string().min(1, "Trade specialty is required"),
  location: z.string().min(1, "Location is required"),
  job_type: z.string().min(1, "Employment type is required"),
  shift_pattern: z.string().optional(),
  start_date: z.string().optional(),
  salary_min: z.number().min(0, "Minimum salary must be 0 or greater"),
  salary_max: z.number().min(0, "Maximum salary must be 0 or greater"),
  // Step 2: Requirements
  certifications: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  education_level: z.string().optional(),
  transportation: z.string().optional(),
  // Step 3: Preferences (optional for now)
  preferences: z.record(z.string(), z.number()).optional(),
  // Step 4: Description
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

export default function PostJobPage() {
  const { company, user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCompanyNotice, setShowCompanyNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noticeModal, setNoticeModal] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant: "success" | "error" | "info";
  }>({
    open: false,
    title: "",
    variant: "info",
  });

  const steps: StepperStep[] = [
    { id: "basics", title: "Role Basics" },
    { id: "requirements", title: "Requirements" },
    { id: "preferences", title: "Preferences" },
    { id: "description", title: "Description" },
  ];

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      certifications: [],
      skills: [],
      salary_min: 0,
      salary_max: 0,
      preferences: {
        technicalSkills: 30,
        experienceLevel: 15,
        trainabilityAlignment: 15,
        softSkillsCulture: 20,
        schedulePayFit: 10,
        proximityAvailability: 10,
      },
    },
    mode: "onChange",
  });

  // Check authentication and company on mount
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading

    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    // Only check for company after auth loading is complete
    if (!company) {
      setShowCompanyNotice(true);
    }

    setLoading(false);
  }, [isAuthenticated, company, authLoading, router]);

  const handleNext = async (e?: React.MouseEvent) => {
    // Prevent any form submission
    e?.preventDefault();
    e?.stopPropagation();

    // Validate current step before proceeding
    let fieldsToValidate: (keyof JobFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "title",
        "trade_specialty",
        "location",
        "job_type",
        "salary_min",
        "salary_max",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["education_level", "transportation"];
    } else if (currentStep === 3) {
      // Preferences step - no required fields
    } else if (currentStep === 4) {
      fieldsToValidate = ["description"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (!company || !user) {
      setShowCompanyNotice(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Show loading modal
      setNoticeModal({
        open: true,
        title: "Creating Job Posting...",
        description: "Please wait while we create your job posting.",
        variant: "info",
      });

      await insertJob({
        title: data.title,
        description: data.description,
        location: data.location,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        job_type: data.job_type,
        status: null as string | null, // Start as NULL, admin will approve and set to "open"
        requirements: data.requirements || "",
        skills: data.skills || [],
        trade_specialty: data.trade_specialty,
        posted_by: user.id,
        employer_id: user.id,
        company_id: company.id,
        posted_date: new Date().toISOString(),
      });

      // Show success modal
      setNoticeModal({
        open: true,
        title: "Job Posted Successfully!",
        description:
          "Your job posting has been created and is pending admin approval. You will be redirected to your jobs page.",
        variant: "success",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/employer/jobs");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to create job:", error);
      const errorMessage = error.message || "Failed to create job posting";
      setSubmitError(errorMessage);
      setNoticeModal({
        open: true,
        title: "Failed to Create Job",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PageSkeleton variant="form" />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Post a New Job
                </h1>
                <p className="text-main-light-text">
                  Fill out the details below to create a new job posting. All
                  postings require admin approval before going live.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push("/employer/jobs")}
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </Button>
            </div>

            {/* Admin Notice */}
            <div className="mt-4 p-4 bg-main-accent/10 border border-main-accent/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon
                  icon="lucide:info"
                  className="w-5 h-5 text-main-accent mt-0.5"
                />
                <p className="text-sm text-main-text">
                  Your job posting will be reviewed by our admin team before it
                  appears on the job board. This typically takes 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-surface border border-subtle rounded-2xl shadow-lg overflow-hidden">
            {/* Stepper */}
            <div className="px-6 pt-6 pb-4 border-b border-subtle">
              <Stepper steps={steps} currentStep={currentStep} />
            </div>

            {/* Form Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Only submit if we're on the last step and user clicked submit button
                if (currentStep === steps.length) {
                  handleSubmit(
                    (data) => {
                      console.log("Form validation passed, submitting:", data);
                      onSubmit(data);
                    },
                    (errors) => {
                      console.log("Form validation errors:", errors);
                      setSubmitError(
                        "Please fix the errors in the form before submitting."
                      );
                      // Scroll to first error
                      const firstErrorField = Object.keys(errors)[0];
                      if (firstErrorField) {
                        const element = document.querySelector(
                          `[name="${firstErrorField}"]`
                        );
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }
                    }
                  )();
                }
              }}
              onKeyDown={(e) => {
                // Prevent Enter key from submitting form unless it's on the submit button
                if (e.key === "Enter") {
                  const target = e.target as HTMLElement;

                  // If Enter is pressed on an input/textarea and we're on the last step, prevent submission
                  if (
                    (target.tagName === "INPUT" ||
                      target.tagName === "TEXTAREA") &&
                    currentStep === steps.length
                  ) {
                    e.preventDefault();
                    return;
                  }

                  // On non-final steps, prevent default form submission
                  if (currentStep < steps.length) {
                    e.preventDefault();
                    // Optionally allow Enter to go to next step
                    if (
                      target.tagName === "INPUT" ||
                      target.tagName === "TEXTAREA"
                    ) {
                      handleNext();
                    }
                  }
                }
              }}
            >
              <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                {currentStep === 1 && (
                  <RoleBasicsStep
                    register={register}
                    errors={errors}
                    setValue={setValue}
                  />
                )}
                {currentStep === 2 && (
                  <RequirementsStep
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {currentStep === 3 && (
                  <PreferencesStep setValue={setValue} watch={watch} />
                )}
                {currentStep === 4 && (
                  <DescriptionStep register={register} errors={errors} />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-subtle bg-light-bg/50">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/employer/jobs")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  {currentStep === steps.length ? (
                    <Button
                      type="submit"
                      variant="accent"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        // Ensure we're on the last step before submitting
                        if (currentStep !== steps.length) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      {isSubmitting ? "Posting..." : "Post Job"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="accent"
                      onClick={(e) => handleNext(e)}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
              {submitError && (
                <div className="px-6 pb-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-500">{submitError}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Company Notice Modal */}
      <NoticeModal
        open={showCompanyNotice}
        title="Company Profile Required"
        description="You need to create a company profile before you can post jobs. This helps candidates learn about your company and builds trust."
        variant="info"
        onClose={() => {
          setShowCompanyNotice(false);
          router.push("/employer/dashboard");
        }}
        primaryAction={{
          label: "Create Company Profile",
          onClick: () => {
            setShowCompanyNotice(false);
            router.push("/employer/profile/setup");
          },
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setShowCompanyNotice(false);
            router.push("/employer/dashboard");
          },
        }}
      />

      {/* Job Posting Notice Modal */}
      <NoticeModal
        open={noticeModal.open}
        title={noticeModal.title}
        description={noticeModal.description}
        variant={noticeModal.variant}
        onClose={() => {
          if (noticeModal.variant !== "info") {
            setNoticeModal({ open: false, title: "", variant: "info" });
          }
        }}
        primaryAction={
          noticeModal.variant === "error"
            ? {
                label: "OK",
                onClick: () => {
                  setNoticeModal({ open: false, title: "", variant: "info" });
                },
              }
            : undefined
        }
      />
    </div>
  );
}
