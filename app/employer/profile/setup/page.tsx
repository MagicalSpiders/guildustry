"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/components/AuthProvider";
import { insertCompany } from "@/src/lib/companyFunctions";

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry is required"),
  founded: z
    .string()
    .regex(/^\d{4}$/, "Please enter a valid year (e.g., 2020)"),
  headquarters: z.string().min(3, "Headquarters location is required"),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL (must start with http:// or https://)"
    )
    .or(z.literal("")),
  description: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || val.length >= 10,
      "Description must be at least 10 characters if provided"
    )
    .or(z.literal("")),
  size: z.string().optional(),
  contact_email: z.string().email("Please enter a valid email"),
  contact_phone: z.string().min(10, "Please enter a valid phone number"),
  contact_address: z.string().min(5, "Please enter a valid address"),
  linkedin: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
});

type CompanyFormData = z.infer<typeof companySchema>;

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

export default function CompanySetupPage() {
  const { user, isAuthenticated, refreshCompany } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 4;
  const stepTitles = [
    "Basic Information",
    "Description",
    "Contact Details",
    "Social Media",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      contact_email: user?.email || "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    // Pre-fill email
    if (user?.email) {
      setValue("contact_email", user.email);
    }
  }, [isAuthenticated, user, router, setValue]);

  const handleNext = async () => {
    // Validate current step before proceeding
    let fieldsToValidate: (keyof CompanyFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "name",
        "industry",
        "founded",
        "headquarters",
        "website",
      ];
    } else if (currentStep === 2) {
      // Description is optional, so no validation needed
    } else if (currentStep === 3) {
      fieldsToValidate = ["contact_email", "contact_phone", "contact_address"];
    } else if (currentStep === 4) {
      // Social media is optional, so no validation needed
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Calling insertCompany with:", {
        owner_id: user.id,
        name: data.name,
        industry: data.industry,
        founded: data.founded,
        headquarters: data.headquarters,
        website: data.website || null,
        description: data.description || null,
        size: data.size || null,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        contact_address: data.contact_address,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        facebook: data.facebook || null,
        specialties: [],
        values: [],
        benefits: [],
      });

      const result = await insertCompany({
        owner_id: user.id,
        name: data.name,
        industry: data.industry,
        founded: data.founded,
        headquarters: data.headquarters,
        website: data.website || null,
        description: data.description || null,
        size: data.size || null,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        contact_address: data.contact_address,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        facebook: data.facebook || null,
        specialties: [],
        values: [],
        benefits: [],
      });

      console.log("Company created successfully:", result);

      // Refresh company data
      await refreshCompany();

      // Redirect to company profile
      router.push("/employer/profile");
    } catch (err: any) {
      console.error("Failed to create company:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
      });

      // Provide more helpful error messages
      let errorMessage = err.message || "Failed to create company profile";

      // Check if it's a database schema error
      if (
        errorMessage.includes("column") &&
        errorMessage.includes("not found")
      ) {
        errorMessage =
          "Database schema error: The companies table may not be set up correctly. Please ensure the Supabase table has been created with the correct schema. The column should be named 'name' (not 'company_name'). Check the SETUP_STEPS.md file for the SQL migration.";
      } else if (errorMessage.includes("schema cache")) {
        errorMessage =
          "Database schema cache error: The Supabase schema cache may be out of sync. Try refreshing your Supabase project or check if the companies table exists with the correct column names (name, industry, etc.).";
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Set Up Your Company Profile
            </h1>
            <p className="text-main-light-text">
              Let's get your company set up on Guildustry so you can start
              hiring skilled trades workers.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

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
                  setError(
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
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-title font-semibold text-main-text">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("name")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="ABC Construction"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Industry <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("industry")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.industry
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="Construction & Skilled Trades"
                        />
                        {errors.industry && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.industry.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-main-light-text">
                            Founded Year <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("founded")}
                            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                              errors.founded
                                ? "border-red-500 focus:ring-red-500"
                                : "border-subtle focus:ring-main-accent"
                            }`}
                            placeholder="2020"
                          />
                          {errors.founded && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.founded.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-main-light-text">
                            Company Size
                          </label>
                          <select
                            {...register("size")}
                            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                          >
                            <option value="">Select size</option>
                            <option value="1-10 employees">
                              1-10 employees
                            </option>
                            <option value="11-50 employees">
                              11-50 employees
                            </option>
                            <option value="50-200 employees">
                              50-200 employees
                            </option>
                            <option value="200-500 employees">
                              200-500 employees
                            </option>
                            <option value="500+ employees">
                              500+ employees
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Headquarters <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("headquarters")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.headquarters
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="New York, NY"
                        />
                        {errors.headquarters && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.headquarters.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Website
                        </label>
                        <input
                          type="url"
                          {...register("website")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.website
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="https://www.yourcompany.com"
                        />
                        {errors.website && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.website.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Description */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-title font-semibold text-main-text">
                      Company Description
                    </h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Tell candidates about your company
                      </label>
                      <textarea
                        {...register("description")}
                        rows={10}
                        className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors resize-none ${
                          errors.description
                            ? "border-red-500 focus:ring-red-500"
                            : "border-subtle focus:ring-main-accent"
                        }`}
                        placeholder="Describe your company's mission, values, culture, and what makes you a great place to work..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                      <p className="text-xs text-main-light-text mt-2">
                        This description will help candidates learn about your
                        company and decide if it's a good fit for them.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-title font-semibold text-main-text">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          {...register("contact_email")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.contact_email
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="careers@yourcompany.com"
                        />
                        {errors.contact_email && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.contact_email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register("contact_phone")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.contact_phone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="(555) 123-4567"
                        />
                        {errors.contact_phone && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.contact_phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Office Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("contact_address")}
                          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                            errors.contact_address
                              ? "border-red-500 focus:ring-red-500"
                              : "border-subtle focus:ring-main-accent"
                          }`}
                          placeholder="123 Main St, New York, NY 10001"
                        />
                        {errors.contact_address && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.contact_address.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Social Media */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-title font-semibold text-main-text">
                      Social Media
                    </h3>
                    <p className="text-main-light-text text-sm">
                      Add your social media profiles to help candidates learn
                      more about your company. All fields are optional.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          {...register("linkedin")}
                          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                          placeholder="linkedin.com/company/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Twitter
                        </label>
                        <input
                          type="text"
                          {...register("twitter")}
                          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                          placeholder="@username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Facebook
                        </label>
                        <input
                          type="text"
                          {...register("facebook")}
                          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                          placeholder="facebook.com/..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Navigation */}
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
                    onClick={() => router.push("/employer/dashboard")}
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
                      {isSubmitting
                        ? "Creating Company..."
                        : "Create Company Profile"}
                    </Button>
                  ) : (
                    <Button type="button" variant="accent" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
