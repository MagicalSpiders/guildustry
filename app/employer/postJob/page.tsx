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

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

function Stepper({ currentStep, totalSteps, stepTitles }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = stepNumber === totalSteps;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-main-accent text-white"
                      : isActive
                      ? "bg-main-accent text-white"
                      : "bg-surface border-2 border-subtle text-main-light-text"
                  }`}
                >
                  {isCompleted ? (
                    <Icon icon="lucide:check" className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="ml-3 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? "text-main-text" : "text-main-light-text"
                    }`}
                  >
                    {stepTitles[index]}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? "bg-main-accent" : "bg-subtle"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PostJobPage() {
  const { company, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCompanyNotice, setShowCompanyNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const totalSteps = 4;
  const stepTitles = [
    "Role Basics",
    "Requirements",
    "Preferences",
    "Description",
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
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (!company) {
      setShowCompanyNotice(true);
    }

    setLoading(false);
  }, [isAuthenticated, company, router]);

  const handleNext = async () => {
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
    if (isValid && currentStep < totalSteps) {
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
      await insertJob({
        title: data.title,
        description: data.description,
        location: data.location,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        job_type: data.job_type,
        status: "draft", // Start as draft, admin will approve
        requirements: data.requirements || "",
        skills: data.skills || [],
        trade_specialty: data.trade_specialty,
        posted_by: user.id,
        employer_id: user.id,
        company_id: company.id,
        posted_date: new Date().toISOString(),
      });

      // Success - redirect to jobs page
      router.push("/employer/jobs");
    } catch (error: any) {
      console.error("Failed to create job:", error);
      setSubmitError(error.message || "Failed to create job posting");
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
        <div className="max-w-4xl mx-auto">
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
              <Stepper
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepTitles={stepTitles}
              />
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit(
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
              )}
              onKeyDown={(e) => {
                // Prevent form submission on Enter key unless on last step
                if (e.key === "Enter" && currentStep < totalSteps) {
                  e.preventDefault();
                  handleNext();
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
                  {currentStep === totalSteps ? (
                    <Button
                      type="submit"
                      variant="accent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post Job"}
                    </Button>
                  ) : (
                    <Button type="button" variant="accent" onClick={handleNext}>
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
    </div>
  );
}

// Step Components
interface StepProps {
  register: any;
  errors?: any;
  setValue?: any;
  watch?: any;
}

function RoleBasicsStep({ register, errors, setValue }: StepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-title font-semibold text-main-text">
        Role Basics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Licensed Electrician"
            {...register("title")}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Trade Specialty <span className="text-red-500">*</span>
          </label>
          <select
            {...register("trade_specialty")}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.trade_specialty
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          >
            <option value="">Select specialty</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="HVAC">HVAC</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Welding">Welding</option>
          </select>
          {errors.trade_specialty && (
            <p className="mt-1 text-sm text-red-500">
              {errors.trade_specialty.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. New York, NY"
          {...register("location")}
          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
            errors.location
              ? "border-red-500 focus:ring-red-500"
              : "border-subtle focus:ring-main-accent"
          }`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("job_type")}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.job_type
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          >
            <option value="">Select type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
          {errors.job_type && (
            <p className="mt-1 text-sm text-red-500">{errors.job_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Shift Pattern
          </label>
          <select
            {...register("shift_pattern")}
            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
          >
            <option value="">Select pattern</option>
            <option value="day">Day Shift</option>
            <option value="night">Night Shift</option>
            <option value="rotating">Rotating</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Minimum Salary ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            {...register("salary_min", { valueAsNumber: true })}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.salary_min
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          />
          {errors.salary_min && (
            <p className="mt-1 text-sm text-red-500">
              {errors.salary_min.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Maximum Salary ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 80000"
            {...register("salary_max", { valueAsNumber: true })}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.salary_max
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          />
          {errors.salary_max && (
            <p className="mt-1 text-sm text-red-500">
              {errors.salary_max.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Start Date
        </label>
        <input
          type="date"
          {...register("start_date")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>
    </div>
  );
}

function RequirementsStep({ register, errors, setValue, watch }: StepProps) {
  const certifications = [
    "OSHA 10-Hour Safety",
    "OSHA 30-Hour Safety",
    "EPA 608 Certification",
    "Journeyman Electrician License",
    "Master Electrician License",
    "Journeyman Plumber License",
    "Master Plumber License",
    "HVAC Excellence Certification",
    "NATE Certification",
    "Welding Certification (AWS)",
    "Forklift Operator Certification",
    "CPR/First Aid",
    "Crane Operator Certification",
    "Confined Space Entry",
    "Scaffold User/Builder",
    "Other",
  ];

  const skills = [
    "Blueprint Reading",
    "Electrical Troubleshooting",
    "Circuit Installation",
    "PLC Programming",
    "Pipe Installation",
    "Welding",
    "HVAC Installation",
    "HVAC Repair",
    "Carpentry",
    "Concrete Work",
    "Equipment Operation",
    "Safety Compliance",
    "Project Management",
  ];

  const selectedCerts = watch("certifications") || [];
  const selectedSkills = watch("skills") || [];

  const handleCertChange = (cert: string, checked: boolean) => {
    if (checked) {
      setValue("certifications", [...selectedCerts, cert]);
    } else {
      setValue(
        "certifications",
        selectedCerts.filter((c: string) => c !== cert)
      );
    }
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setValue("skills", [...selectedSkills, skill]);
    } else {
      setValue("skills", selectedSkills.filter((s: string) => s !== skill));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-title font-semibold text-main-text">
        Requirements
      </h3>

      <div>
        <label className="block text-sm font-medium mb-3 text-main-light-text">
          Required Certifications/Licenses
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certifications.map((cert) => (
            <label
              key={cert}
              className="flex items-center gap-2 p-2 hover:bg-light-bg rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCerts.includes(cert)}
                onChange={(e) => handleCertChange(cert, e.target.checked)}
                className="w-4 h-4 text-main-accent focus:ring-main-accent rounded"
              />
              <span className="text-sm text-main-text">{cert}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-main-light-text mt-2">
          Select all certifications/licenses required for this position
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-main-light-text">
          Priority Skills
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-2 p-2 hover:bg-light-bg rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={(e) => handleSkillChange(skill, e.target.checked)}
                className="w-4 h-4 text-main-accent focus:ring-main-accent rounded"
              />
              <span className="text-sm text-main-text">{skill}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-main-light-text mt-2">
          Select skills that are most important for this position
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Minimum Education Level
          </label>
          <select
            {...register("education_level")}
            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
          >
            <option value="">Select minimum education</option>
            <option value="high-school">High School Diploma/GED</option>
            <option value="trade-school">Trade School Certificate</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="none">No formal education required</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-main-light-text">
            Travel/Transportation Requirements
          </label>
          <div className="space-y-2">
            {[
              "Driver's license & own vehicle required",
              "Driver's license & own vehicle preferred",
              "Not required",
            ].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={option}
                  {...register("transportation")}
                  className="w-4 h-4 text-main-accent focus:ring-main-accent"
                />
                <span className="text-sm text-main-text">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ setValue, watch }: StepProps) {
  const defaultPreferences = {
    technicalSkills: 30,
    experienceLevel: 15,
    trainabilityAlignment: 15,
    softSkillsCulture: 20,
    schedulePayFit: 10,
    proximityAvailability: 10,
  };

  const preferences = watch("preferences") || defaultPreferences;

  const handleSliderChange = (key: string, value: number) => {
    setValue("preferences", { ...preferences, [key]: value });
  };

  const total = Object.values(preferences).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-title font-semibold text-main-text">
          Scoring & Matching Preferences
        </h3>
        <p className="text-main-light-text mt-1">
          Rank the importance of each factor (must total 100%)
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(preferences).map(([key, value]) => {
          const labels = {
            technicalSkills: "Technical Skills",
            experienceLevel: "Experience Level",
            trainabilityAlignment: "Trainability Alignment",
            softSkillsCulture: "Soft Skills & Culture",
            schedulePayFit: "Schedule & Pay Fit",
            proximityAvailability: "Proximity & Availability",
          };

          return (
            <div key={key} className="relative">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-main-text">
                  {labels[key as keyof typeof labels]}
                </label>
                <span className="text-sm font-semibold text-main-accent min-w-14 text-right">
                  {value}%
                </span>
              </div>
              <div className="relative h-3 bg-subtle rounded-full">
                {/* Filled track - accent color */}
                <div
                  className="absolute h-full bg-main-accent rounded-full transition-all duration-200"
                  style={{ width: `${value}%` }}
                />
                {/* Invisible input for interaction */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) =>
                    handleSliderChange(key, parseInt(e.target.value))
                  }
                  className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-10"
                />
                {/* Circular marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-main-accent shadow-md border-2 border-surface transition-all duration-200 hover:scale-110"
                  style={{ left: `calc(${value}% - 12px)` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <span
          className={`text-sm font-medium ${
            total === 100 ? "text-green-500" : "text-red-500"
          }`}
        >
          Total: {total}%{" "}
          {total === 100 && (
            <Icon icon="lucide:check" className="inline w-4 h-4 ml-1" />
          )}
        </span>
      </div>
    </div>
  );
}

function DescriptionStep({ register, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-title font-semibold text-main-text">
        Job Description
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={12}
          placeholder="Describe the role, responsibilities, and work environment..."
          {...register("description")}
          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors resize-none ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-subtle focus:ring-main-accent"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
        <p className="text-xs text-main-light-text mt-2">
          Provide a detailed description of the position
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Additional Requirements (Optional)
        </label>
        <textarea
          rows={6}
          placeholder="List any additional requirements, expectations, or notes..."
          {...register("requirements")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors resize-none"
        />
      </div>
    </div>
  );
}

