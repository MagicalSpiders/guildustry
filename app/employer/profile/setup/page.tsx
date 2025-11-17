"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/components/AuthProvider";
import {
  insertCompany,
  updateCompany,
  uploadCompanyLogo,
} from "@/src/lib/companyFunctions";
import { Stepper, type StepperStep } from "@/src/components/Stepper";

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
  logo_url: z.string().optional().or(z.literal("")),
  members_count: z.coerce.number().int().min(0).default(0),
  specialties: z.array(z.string()).default([]),
  values: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  contact_email: z.string().email("Please enter a valid email"),
  contact_phone: z.string().min(10, "Please enter a valid phone number"),
  contact_address: z.string().min(5, "Please enter a valid address"),
  linkedin: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanySetupPage() {
  const { user, isAuthenticated, refreshCompany } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const steps: StepperStep[] = [
    { id: "basic", title: "Basic Information" },
    { id: "description", title: "Description" },
    { id: "culture", title: "Company Culture" },
    { id: "contact", title: "Contact Details" },
    { id: "social", title: "Social Media" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema) as any,
    defaultValues: {
      contact_email: user?.email || "",
      specialties: [],
      values: [],
      benefits: [],
      members_count: 0,
      logo_url: "",
    },
  });

  const specialties = watch("specialties") || [];
  const values = watch("values") || [];
  const benefits = watch("benefits") || [];

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

  const handleNext = async (e?: React.MouseEvent) => {
    // Prevent any form submission
    e?.preventDefault();
    e?.stopPropagation();

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
      // Company culture (specialties, values, benefits) is optional
    } else if (currentStep === 4) {
      fieldsToValidate = ["contact_email", "contact_phone", "contact_address"];
    } else if (currentStep === 5) {
      // Social media is optional, so no validation needed
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    // Only advance if not on last step
    if (currentStep < steps.length) {
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

      // Filter out empty strings from arrays
      const specialties = (data.specialties || []).filter(
        (s) => s.trim() !== ""
      );
      const values = (data.values || []).filter((v) => v.trim() !== "");
      const benefits = (data.benefits || []).filter((b) => b.trim() !== "");

      // Handle logo upload
      let logoUrl = data.logo_url || null;
      if (logoFile && user) {
        try {
          // We'll upload the logo after creating the company
          // For now, we'll create the company first, then upload the logo
        } catch (uploadError: any) {
          console.error("Logo upload error:", uploadError);
          // Continue without logo if upload fails
        }
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
        specialties,
        values,
        benefits,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        contact_address: data.contact_address,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        facebook: data.facebook || null,
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
        logo_url: logoUrl,
        members_count: data.members_count || 0,
        specialties,
        values,
        benefits,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        contact_address: data.contact_address,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        facebook: data.facebook || null,
      });

      // Upload logo after company is created
      if (logoFile && result.id) {
        try {
          const uploadedLogoUrl = await uploadCompanyLogo(logoFile, result.id);
          // Update company with logo URL
          await updateCompany({
            logo_url: uploadedLogoUrl,
          });
        } catch (uploadError: any) {
          console.error("Logo upload error:", uploadError);
          // Continue even if logo upload fails
        }
      }

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
        <div className="max-w-7xl mx-auto">
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
              <Stepper steps={steps} currentStep={currentStep} />
            </div>

            {/* Form Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Only submit if we're on the last step and user clicked submit button
                if (currentStep === steps.length) {
                  handleSubmit(
                    (data: CompanyFormData) => {
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
                        <div>
                          <label className="block text-sm font-medium mb-2 text-main-light-text">
                            Number of Members
                          </label>
                          <input
                            type="number"
                            {...register("members_count", {
                              valueAsNumber: true,
                            })}
                            min="0"
                            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-main-light-text">
                          Company Logo
                        </label>
                        <div className="space-y-3">
                          {logoPreview && (
                            <div className="relative w-32 h-32 border border-subtle rounded-lg overflow-hidden">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setLogoFile(null);
                                  setLogoPreview(null);
                                  setValue("logo_url", "");
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <Icon icon="lucide:x" className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setLogoFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setLogoPreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                          />
                          <p className="text-xs text-main-light-text">
                            Upload your company logo (PNG, JPG, or GIF)
                          </p>
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

                {/* Step 3: Company Culture */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-title font-semibold text-main-text">
                      Company Culture
                    </h3>
                    <p className="text-main-light-text text-sm">
                      Help candidates understand your company's specialties,
                      values, and benefits. All fields are optional.
                    </p>

                    {/* Specialties */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Specialties
                      </label>
                      <div className="space-y-2">
                        {specialties.map((specialty, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              {...register(`specialties.${index}`)}
                              className="flex-1 px-4 py-2 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                              placeholder="Enter specialty"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecialties = specialties.filter(
                                  (_, i) => i !== index
                                );
                                setValue("specialties", newSpecialties);
                              }}
                              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
                            >
                              <Icon
                                icon="lucide:trash-2"
                                className="w-5 h-5 text-red-400"
                              />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setValue("specialties", [...specialties, ""]);
                          }}
                          className="flex items-center gap-2 text-sm text-main-accent hover:text-main-highlight"
                        >
                          <Icon icon="lucide:plus" className="w-4 h-4" />
                          Add Specialty
                        </button>
                      </div>
                    </div>

                    {/* Values */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Company Values
                      </label>
                      <div className="space-y-2">
                        {values.map((value, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              {...register(`values.${index}`)}
                              className="flex-1 px-4 py-2 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                              placeholder="Enter value"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newValues = values.filter(
                                  (_, i) => i !== index
                                );
                                setValue("values", newValues);
                              }}
                              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
                            >
                              <Icon
                                icon="lucide:trash-2"
                                className="w-5 h-5 text-red-400"
                              />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setValue("values", [...values, ""]);
                          }}
                          className="flex items-center gap-2 text-sm text-main-accent hover:text-main-highlight"
                        >
                          <Icon icon="lucide:plus" className="w-4 h-4" />
                          Add Value
                        </button>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Benefits & Perks
                      </label>
                      <div className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              {...register(`benefits.${index}`)}
                              className="flex-1 px-4 py-2 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
                              placeholder="Enter benefit"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newBenefits = benefits.filter(
                                  (_, i) => i !== index
                                );
                                setValue("benefits", newBenefits);
                              }}
                              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
                            >
                              <Icon
                                icon="lucide:trash-2"
                                className="w-5 h-5 text-red-400"
                              />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setValue("benefits", [...benefits, ""]);
                          }}
                          className="flex items-center gap-2 text-sm text-main-accent hover:text-main-highlight"
                        >
                          <Icon icon="lucide:plus" className="w-4 h-4" />
                          Add Benefit
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Contact Information */}
                {currentStep === 4 && (
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

                {/* Step 5: Social Media */}
                {currentStep === 5 && (
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
                      {isSubmitting
                        ? "Creating Company..."
                        : "Create Company Profile"}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
