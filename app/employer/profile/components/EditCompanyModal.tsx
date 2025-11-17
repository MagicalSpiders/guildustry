"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { CompanyProfile } from "../data/mockCompanyData";

interface EditCompanyModalProps {
  open: boolean;
  onClose: () => void;
  company: CompanyProfile;
  onSave: (updatedCompany: CompanyProfile) => void;
}

export function EditCompanyModal({
  open,
  onClose,
  company,
  onSave,
}: EditCompanyModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<CompanyProfile>(company);

  useEffect(() => {
    if (open) {
      // Ensure all fields have proper defaults for empty/null values
      setFormData({
        ...company,
        website: company.website || "",
        description: company.description || "",
        size: company.size || "",
        specialties: company.specialties || [],
        values: company.values || [],
        benefits: company.benefits || [],
        contact: {
          email: company.contact.email || "",
          phone: company.contact.phone || "",
          address: company.contact.address || "",
        },
        socialMedia: {
          linkedin: company.socialMedia?.linkedin || "",
          twitter: company.socialMedia?.twitter || "",
          facebook: company.socialMedia?.facebook || "",
        },
      });
      setIsAnimating(false);
    }
  }, [open, company]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleChange = (
    field: keyof CompanyProfile,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [field]: value || undefined, // Convert empty string to undefined
      },
    }));
  };

  const handleArrayChange = (
    field: "specialties" | "values" | "benefits",
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: "specialties" | "values" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "specialties" | "values" | "benefits",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (!open && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
            open && !isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div
          className={`relative w-full max-w-4xl bg-surface rounded-2xl shadow-2xl border border-subtle max-h-[90vh] overflow-hidden transition-all duration-200 ${
            open && !isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-subtle">
            <div>
              <h2 className="text-2xl font-title font-bold text-main-text">
                Edit Company Profile
              </h2>
              <p className="text-main-light-text mt-1">
                Update your company information to attract the best candidates
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <Icon icon="lucide:x" className="w-5 h-5 text-main-light-text" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
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
              <Button variant="outline" size="md" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="accent" size="md" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
