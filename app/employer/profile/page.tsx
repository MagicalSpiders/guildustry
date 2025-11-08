"use client";

import { useState } from "react";
import { CompanyHeader } from "@/src/app/employer/profile/components/CompanyHeader";
import { CompanyStats } from "@/src/app/employer/profile/components/CompanyStats";
import { CompanyDescription } from "@/src/app/employer/profile/components/CompanyDescription";
import { CompanyDetails } from "@/src/app/employer/profile/components/CompanyDetails";
import { CompanyBenefits } from "@/src/app/employer/profile/components/CompanyBenefits";
import { CompanyContact } from "@/src/app/employer/profile/components/CompanyContact";
import { EditCompanyModal } from "@/src/app/employer/profile/components/EditCompanyModal";
import { mockCompanyData, CompanyProfile } from "@/src/app/employer/profile/data/mockCompanyData";

export default function EmployerProfilePage() {
  const [company, setCompany] = useState<CompanyProfile>(mockCompanyData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedCompany: CompanyProfile) => {
    setCompany(updatedCompany);
    // In a real app, this would make an API call to save the changes
    console.log("Company profile updated:", updatedCompany);
  };

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <CompanyHeader company={company} onEdit={handleEdit} />
        <CompanyStats stats={company.stats} />
        <CompanyDescription description={company.description} />
        <CompanyDetails company={company} />
        <CompanyBenefits benefits={company.benefits} />
        <CompanyContact
          contact={company.contact}
          socialMedia={company.socialMedia}
        />
      </div>

      <EditCompanyModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        company={company}
        onSave={handleSave}
      />
    </div>
  );
}

