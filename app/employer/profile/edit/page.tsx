"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { CompanyProfile } from "@/app/employer/profile/data/mockCompanyData";
import { useAuth } from "@/src/components/AuthProvider";
import {
  updateCompany,
  getCompanyByOwner,
  uploadCompanyLogo,
} from "@/src/lib/companyFunctions";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function EditCompanyProfilePage() {
  const router = useRouter();
  const {
    company: authCompany,
    refreshCompany,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const [formData, setFormData] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("[Flow] Not authenticated - redirecting to sign-in");
      router.push("/auth/sign-in");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load company data
  useEffect(() => {
    if (authLoading) return;

    const loadCompany = async () => {
      try {
        let companyData = authCompany;

        if (!companyData) {
          companyData = await getCompanyByOwner();
          if (companyData) {
            await refreshCompany();
          }
        }

        if (companyData) {
          const uiCompany: CompanyProfile = {
            id: companyData.id,
            companyName: companyData.name,
            industry: companyData.industry,
            founded: companyData.founded,
            headquarters: companyData.headquarters,
            website: companyData.website || "",
            description: companyData.description || "",
            size: companyData.size || "",
            logo_url: companyData.logo_url || null,
            members_count: companyData.members_count || 0,
            specialties: companyData.specialties || [],
            values: companyData.values || [],
            benefits: companyData.benefits || [],
            contact: {
              email: companyData.contact_email,
              phone: companyData.contact_phone,
              address: companyData.contact_address,
            },
            stats: {
              totalEmployees: 0,
              activeJobs: 0,
              totalHires: 0,
              yearsInBusiness:
                new Date().getFullYear() - parseInt(companyData.founded),
            },
            socialMedia: {
              linkedin: companyData.linkedin || undefined,
              twitter: companyData.twitter || undefined,
              facebook: companyData.facebook || undefined,
            },
          };
          setFormData(uiCompany);
          if (companyData.logo_url) {
            setLogoPreview(companyData.logo_url);
          }
        } else {
          // No company found - redirect to setup
          console.log("[Flow] No company - redirecting to setup");
          router.push("/employer/profile/setup");
        }
      } catch (error: any) {
        console.error("[Company] Load error:", error.message);
        setError(error.message || "Failed to load company");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [authCompany, authLoading, router, refreshCompany]);

  const handleChange = (
    field: keyof CompanyProfile,
    value: string | string[] | number | null
  ) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleContactChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            contact: { ...prev.contact, [field]: value },
          }
        : null
    );
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            socialMedia: {
              ...prev.socialMedia,
              [field]: value || undefined,
            },
          }
        : null
    );
  };

  const handleArrayChange = (
    field: "specialties" | "values" | "benefits",
    index: number,
    value: string
  ) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return null;
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: "specialties" | "values" | "benefits") => {
    if (!formData) return;
    setFormData((prev) =>
      prev ? { ...prev, [field]: [...prev[field], ""] } : null
    );
  };

  const removeArrayItem = (
    field: "specialties" | "values" | "benefits",
    index: number
  ) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);

    try {
      // Handle logo upload if a new file was selected
      let logoUrl = formData.logo_url;
      if (logoFile && formData.id) {
        try {
          logoUrl = await uploadCompanyLogo(logoFile, formData.id);
        } catch (uploadError: any) {
          console.error("[Company] Logo upload error:", uploadError);
          // Continue with existing logo if upload fails
        }
      }

      await updateCompany({
        name: formData.companyName,
        industry: formData.industry,
        founded: formData.founded,
        headquarters: formData.headquarters,
        website: formData.website || null,
        description: formData.description || null,
        size: formData.size || null,
        logo_url: logoUrl,
        members_count: formData.members_count || 0,
        specialties: formData.specialties || [],
        values: formData.values || [],
        benefits: formData.benefits || [],
        contact_email: formData.contact.email,
        contact_phone: formData.contact.phone,
        contact_address: formData.contact.address,
        linkedin: formData.socialMedia?.linkedin || null,
        twitter: formData.socialMedia?.twitter || null,
        facebook: formData.socialMedia?.facebook || null,
      });

      await refreshCompany();
      router.push("/employer/profile/view");
    } catch (err: any) {
      console.error("[Company] Save error:", err.message);
      setError(err.message || "Failed to update company");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/employer/profile/view");
  };

  if (authLoading || loading) {
    return <PageSkeleton variant="profile" />;
  }

  if (!formData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
              Edit Company Profile
            </h1>
            <p className="text-main-light-text">
              Update your company information to attract the best candidates
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <Icon icon="lucide:x" className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="bg-surface border border-subtle rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          handleChange("companyName", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.industry}
                        onChange={(e) =>
                          handleChange("industry", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Founded Year
                      </label>
                      <input
                        type="text"
                        value={formData.founded}
                        onChange={(e) =>
                          handleChange("founded", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Headquarters
                      </label>
                      <input
                        type="text"
                        value={formData.headquarters}
                        onChange={(e) =>
                          handleChange("headquarters", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Website
                      </label>
                      <input
                        type="text"
                        value={formData.website || ""}
                        onChange={(e) =>
                          handleChange("website", e.target.value)
                        }
                        placeholder="www.example.com"
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Company Size
                      </label>
                      <select
                        value={formData.size || ""}
                        onChange={(e) => handleChange("size", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      >
                        <option value="">Select size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="50-200 employees">
                          50-200 employees
                        </option>
                        <option value="200-500 employees">
                          200-500 employees
                        </option>
                        <option value="500+ employees">500+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Number of Members
                      </label>
                      <input
                        type="number"
                        value={formData.members_count || 0}
                        onChange={(e) =>
                          handleChange(
                            "members_count",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min="0"
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
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
                              if (formData) {
                                handleChange("logo_url", null);
                              }
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
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Company Description
                  </h3>
                  <textarea
                    rows={5}
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors resize-none"
                    placeholder="Describe your company..."
                  />
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Specialties
                  </h3>
                  <div className="space-y-2">
                    {formData.specialties.map((specialty, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={specialty}
                          onChange={(e) =>
                            handleArrayChange(
                              "specialties",
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 px-4 py-2 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                          placeholder="Enter specialty"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("specialties", index)}
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
                      onClick={() => addArrayItem("specialties")}
                      className="flex items-center gap-2 text-sm text-main-accent hover:text-main-highlight"
                    >
                      <Icon icon="lucide:plus" className="w-4 h-4" />
                      Add Specialty
                    </button>
                  </div>
                </div>

                {/* Values */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Company Values
                  </h3>
                  <div className="space-y-2">
                    {formData.values.map((value, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleArrayChange("values", index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                          placeholder="Enter value"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("values", index)}
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
                      onClick={() => addArrayItem("values")}
                      className="flex items-center gap-2 text-sm text-main-accent hover:text-main-highlight"
                    >
                      <Icon icon="lucide:plus" className="w-4 h-4" />
                      Add Value
                    </button>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Benefits & Perks
                  </h3>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) =>
                            handleArrayChange("benefits", index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                          placeholder="Enter benefit"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("benefits", index)}
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
                      onClick={() => addArrayItem("benefits")}
                      className="flex items-center gap-2 text-sm text-main-accent hover:text-main-highlight"
                    >
                      <Icon icon="lucide:plus" className="w-4 h-4" />
                      Add Benefit
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) =>
                          handleContactChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          handleContactChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.contact.address}
                        onChange={(e) =>
                          handleContactChange("address", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold font-title text-main-text mb-4">
                    Social Media
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={formData.socialMedia?.linkedin || ""}
                        onChange={(e) =>
                          handleSocialMediaChange("linkedin", e.target.value)
                        }
                        placeholder="linkedin.com/company/..."
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={formData.socialMedia?.twitter || ""}
                        onChange={(e) =>
                          handleSocialMediaChange("twitter", e.target.value)
                        }
                        placeholder="@username"
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-main-light-text">
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={formData.socialMedia?.facebook || ""}
                        onChange={(e) =>
                          handleSocialMediaChange("facebook", e.target.value)
                        }
                        placeholder="facebook.com/..."
                        className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-subtle bg-light-bg/50">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
