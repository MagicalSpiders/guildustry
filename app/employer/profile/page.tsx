"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyHeader } from "@/app/employer/profile/components/CompanyHeader";
import { CompanyStats } from "@/app/employer/profile/components/CompanyStats";
import { CompanyDescription } from "@/app/employer/profile/components/CompanyDescription";
import { CompanyDetails } from "@/app/employer/profile/components/CompanyDetails";
import { CompanyBenefits } from "@/app/employer/profile/components/CompanyBenefits";
import { CompanyContact } from "@/app/employer/profile/components/CompanyContact";
import { EditCompanyModal } from "@/app/employer/profile/components/EditCompanyModal";
import { CompanyProfile } from "@/app/employer/profile/data/mockCompanyData";
import { useAuth } from "@/src/components/AuthProvider";
import { updateCompany, getCompanyByOwner } from "@/src/lib/companyFunctions";
import type { Company } from "@/src/lib/database.types";
import { Button } from "@/src/components/Button";
import Link from "next/link";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function EmployerProfilePage() {
  const {
    company: authCompany,
    refreshCompany,
    isAuthenticated,
    user,
  } = useAuth();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("[Flow] Not authenticated - redirecting to sign-in");
      router.push("/auth/sign-in");
      return;
    }

    // Convert database company to UI company format
    if (authCompany) {
      console.log("[Company] Converting to UI format");
      const uiCompany: CompanyProfile = {
        id: authCompany.id,
        companyName: authCompany.name,
        industry: authCompany.industry,
        founded: authCompany.founded,
        headquarters: authCompany.headquarters,
        website: authCompany.website || "",
        description: authCompany.description || "",
        size: authCompany.size || "",
        specialties: authCompany.specialties || [],
        values: authCompany.values || [],
        benefits: authCompany.benefits || [],
        contact: {
          email: authCompany.contact_email,
          phone: authCompany.contact_phone,
          address: authCompany.contact_address,
        },
        stats: {
          totalEmployees: 0, // These would come from aggregated data
          activeJobs: 0,
          totalHires: 0,
          yearsInBusiness:
            new Date().getFullYear() - parseInt(authCompany.founded),
        },
        socialMedia: {
          linkedin: authCompany.linkedin || undefined,
          twitter: authCompany.twitter || undefined,
          facebook: authCompany.facebook || undefined,
        },
      };
      setCompany(uiCompany);
      setLoading(false);
    } else {
      console.log("[Company] Not in AuthProvider - fetching directly");
      // Fallback: Try to fetch company directly if AuthProvider hasn't loaded it
      const fetchCompanyDirectly = async () => {
        try {
          const fetchedCompany = await getCompanyByOwner();
          if (fetchedCompany) {
            console.log("[Company] Fetched directly from database");
            const uiCompany: CompanyProfile = {
              id: fetchedCompany.id,
              companyName: fetchedCompany.name,
              industry: fetchedCompany.industry,
              founded: fetchedCompany.founded,
              headquarters: fetchedCompany.headquarters,
              website: fetchedCompany.website || "",
              description: fetchedCompany.description || "",
              size: fetchedCompany.size || "",
              specialties: fetchedCompany.specialties || [],
              values: fetchedCompany.values || [],
              benefits: fetchedCompany.benefits || [],
              contact: {
                email: fetchedCompany.contact_email,
                phone: fetchedCompany.contact_phone,
                address: fetchedCompany.contact_address,
              },
              stats: {
                totalEmployees: 0,
                activeJobs: 0,
                totalHires: 0,
                yearsInBusiness:
                  new Date().getFullYear() - parseInt(fetchedCompany.founded),
              },
              socialMedia: {
                linkedin: fetchedCompany.linkedin || undefined,
                twitter: fetchedCompany.twitter || undefined,
                facebook: fetchedCompany.facebook || undefined,
              },
            };
            setCompany(uiCompany);
            // Refresh AuthProvider's company state
            await refreshCompany();
          } else {
            console.log("[Company] No company found - will show setup page");
          }
        } catch (error: any) {
          console.error("[Company] Fetch error:", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCompanyDirectly();
    }
  }, [authCompany, isAuthenticated, router, user, refreshCompany]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedCompany: CompanyProfile) => {
    console.log("[Company] Saving updates");
    setSaving(true);
    setError(null);
    try {
      // Convert UI format back to database format
      // Convert empty strings to null for optional fields
      await updateCompany({
        name: updatedCompany.companyName,
        industry: updatedCompany.industry,
        founded: updatedCompany.founded,
        headquarters: updatedCompany.headquarters,
        website: updatedCompany.website || null,
        description: updatedCompany.description || null,
        size: updatedCompany.size || null,
        specialties: updatedCompany.specialties || [],
        values: updatedCompany.values || [],
        benefits: updatedCompany.benefits || [],
        contact_email: updatedCompany.contact.email,
        contact_phone: updatedCompany.contact.phone,
        contact_address: updatedCompany.contact.address,
        linkedin: updatedCompany.socialMedia?.linkedin || null,
        twitter: updatedCompany.socialMedia?.twitter || null,
        facebook: updatedCompany.socialMedia?.facebook || null,
      });

      // Refresh company data from backend
      await refreshCompany();
      console.log("[Company] Saved successfully");
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error("[Company] Save error:", err.message);
      setError(err.message || "Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageSkeleton variant="profile" />;
  }

  // If no company exists, redirect to setup
  if (!company) {
    console.log("[Flow] No company - showing setup page");
    return (
      <div className="min-h-screen bg-main-bg text-main-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <div className="max-w-2xl flex flex-col items-center justify-center mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Guildustry!</h1>
            <p className="text-main-light-text mb-8">
              You haven't set up your company profile yet. Let's get started!
            </p>
            <Link href="/employer/profile/setup">
              <Button variant="accent" size="lg">
                Set Up Company Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}
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
