"use client";

import { Icon } from "@iconify/react";

interface RequirementsStepProps {
  register: any;
  errors?: any;
  setValue: any;
  watch: any;
}

const CERTIFICATIONS = [
  { id: "osha10", label: "OSHA 10-Hour Safety", icon: "lucide:shield-check" },
  { id: "osha30", label: "OSHA 30-Hour Safety", icon: "lucide:shield-check" },
  { id: "epa608", label: "EPA 608 Certification", icon: "lucide:award" },
  { id: "journeyman-electrician", label: "Journeyman Electrician License", icon: "lucide:zap" },
  { id: "master-electrician", label: "Master Electrician License", icon: "lucide:zap" },
  { id: "journeyman-plumber", label: "Journeyman Plumber License", icon: "lucide:droplet" },
  { id: "master-plumber", label: "Master Plumber License", icon: "lucide:droplet" },
  { id: "hvac-excellence", label: "HVAC Excellence Certification", icon: "lucide:wind" },
  { id: "nate", label: "NATE Certification", icon: "lucide:wind" },
  { id: "welding-aws", label: "Welding Certification (AWS)", icon: "lucide:flame" },
  { id: "forklift", label: "Forklift Operator Certification", icon: "lucide:package" },
  { id: "cpr", label: "CPR/First Aid", icon: "lucide:heart" },
  { id: "crane", label: "Crane Operator Certification", icon: "lucide:arrow-up" },
  { id: "confined-space", label: "Confined Space Entry", icon: "lucide:box" },
  { id: "scaffold", label: "Scaffold User/Builder", icon: "lucide:layers" },
  { id: "other", label: "Other", icon: "lucide:more-horizontal" },
];

const SKILLS = [
  { id: "blueprint", label: "Blueprint Reading", icon: "lucide:file-text" },
  { id: "electrical-troubleshooting", label: "Electrical Troubleshooting", icon: "lucide:search" },
  { id: "circuit-installation", label: "Circuit Installation", icon: "lucide:git-branch" },
  { id: "plc-programming", label: "PLC Programming", icon: "lucide:code" },
  { id: "pipe-installation", label: "Pipe Installation", icon: "lucide:pipe" },
  { id: "welding", label: "Welding", icon: "lucide:flame" },
  { id: "hvac-installation", label: "HVAC Installation", icon: "lucide:wind" },
  { id: "hvac-repair", label: "HVAC Repair", icon: "lucide:wrench" },
  { id: "carpentry", label: "Carpentry", icon: "lucide:hammer" },
  { id: "concrete", label: "Concrete Work", icon: "lucide:square" },
  { id: "equipment-operation", label: "Equipment Operation", icon: "lucide:settings" },
  { id: "safety-compliance", label: "Safety Compliance", icon: "lucide:shield" },
  { id: "project-management", label: "Project Management", icon: "lucide:clipboard-check" },
];

export function RequirementsStep({
  register,
  errors,
  setValue,
  watch,
}: RequirementsStepProps) {
  const selectedCerts = watch("certifications") || [];
  const selectedSkills = watch("skills") || [];

  const handleCertChange = (certId: string, checked: boolean) => {
    const cert = CERTIFICATIONS.find((c) => c.id === certId)?.label || certId;
    if (checked) {
      setValue("certifications", [...selectedCerts, cert]);
    } else {
      setValue(
        "certifications",
        selectedCerts.filter((c: string) => c !== cert)
      );
    }
  };

  const handleSkillChange = (skillId: string, checked: boolean) => {
    const skill = SKILLS.find((s) => s.id === skillId)?.label || skillId;
    if (checked) {
      setValue("skills", [...selectedSkills, skill]);
    } else {
      setValue(
        "skills",
        selectedSkills.filter((s: string) => s !== skill)
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-title font-semibold text-main-text mb-2">
          Requirements
        </h3>
        <p className="text-sm text-main-light-text">
          Select the certifications, licenses, and skills required for this position.
        </p>
      </div>

      {/* Certifications Section */}
      <div>
        <label className="block text-sm font-medium mb-4 text-main-text">
          Required Certifications & Licenses
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CERTIFICATIONS.map((cert) => {
            const isSelected = selectedCerts.includes(cert.label);
            return (
              <label
                key={cert.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-main-accent/10 border-main-accent"
                    : "bg-light-bg border-subtle hover:border-main-accent/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCertChange(cert.id, e.target.checked)}
                  className="w-4 h-4 text-main-accent focus:ring-main-accent rounded"
                />
                <Icon
                  icon={cert.icon}
                  className={`w-5 h-5 ${
                    isSelected ? "text-main-accent" : "text-main-light-text"
                  }`}
                />
                <span
                  className={`text-sm flex-1 ${
                    isSelected ? "text-main-text font-medium" : "text-main-light-text"
                  }`}
                >
                  {cert.label}
                </span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-main-light-text mt-3">
          {selectedCerts.length > 0
            ? `${selectedCerts.length} certification${selectedCerts.length > 1 ? "s" : ""} selected`
            : "Select all certifications/licenses required for this position"}
        </p>
      </div>

      {/* Skills Section */}
      <div>
        <label className="block text-sm font-medium mb-4 text-main-text">
          Priority Skills
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill.label);
            return (
              <label
                key={skill.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-main-accent/10 border-main-accent"
                    : "bg-light-bg border-subtle hover:border-main-accent/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleSkillChange(skill.id, e.target.checked)}
                  className="w-4 h-4 text-main-accent focus:ring-main-accent rounded"
                />
                <Icon
                  icon={skill.icon}
                  className={`w-5 h-5 ${
                    isSelected ? "text-main-accent" : "text-main-light-text"
                  }`}
                />
                <span
                  className={`text-sm flex-1 ${
                    isSelected ? "text-main-text font-medium" : "text-main-light-text"
                  }`}
                >
                  {skill.label}
                </span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-main-light-text mt-3">
          {selectedSkills.length > 0
            ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? "s" : ""} selected`
            : "Select skills that are most important for this position"}
        </p>
      </div>

      {/* Education & Transportation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-subtle">
        <div>
          <label className="block text-sm font-medium mb-3 text-main-text">
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
          <label className="block text-sm font-medium mb-3 text-main-text">
            Travel/Transportation Requirements
          </label>
          <div className="space-y-2">
            {[
              "Driver's license & own vehicle required",
              "Driver's license & own vehicle preferred",
              "Not required",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 rounded-lg border border-subtle bg-light-bg hover:border-main-accent/50 cursor-pointer transition-all"
              >
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



