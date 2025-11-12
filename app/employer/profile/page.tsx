"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyHeader } from "@/src/app/employer/profile/components/CompanyHeader";
import { CompanyStats } from "@/src/app/employer/profile/components/CompanyStats";
import { CompanyDescription } from "@/src/app/employer/profile/components/CompanyDescription";
import { CompanyDetails } from "@/src/app/employer/profile/components/CompanyDetails";
import { CompanyBenefits } from "@/src/app/employer/profile/components/CompanyBenefits";
import { CompanyContact } from "@/src/app/employer/profile/components/CompanyContact";
import { EditCompanyModal } from "@/src/app/employer/profile/components/EditCompanyModal";
import { CompanyProfile } from "@/src/app/employer/profile/data/mockCompanyData";
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
    console.log("🏢 EmployerProfilePage: useEffect triggered", {
      isAuthenticated,
      hasAuthCompany: !!authCompany,
      authCompanyId: authCompany?.id,
      authCompanyName: authCompany?.name,
      userId: user?.id,
      userEmail: user?.email,
      currentCompany: company?.id,
      loading,
    });

    if (!isAuthenticated) {
      console.log(
        "❌ EmployerProfilePage: User not authenticated, redirecting to sign-in"
      );
      router.push("/auth/sign-in");
      return;
    }

    console.log("✅ EmployerProfilePage: User is authenticated");

    // Convert database company to UI company format
    if (authCompany) {
      console.log(
        "📦 EmployerProfilePage: Converting authCompany to UI format",
        {
          companyId: authCompany.id,
          companyName: authCompany.name,
          industry: authCompany.industry,
          hasDescription: !!authCompany.description,
          specialtiesCount: authCompany.specialties?.length || 0,
          benefitsCount: authCompany.benefits?.length || 0,
        }
      );

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
      console.log("✅ EmployerProfilePage: UI company created, setting state", {
        uiCompanyId: uiCompany.id,
        uiCompanyName: uiCompany.companyName,
      });
      setCompany(uiCompany);
      setLoading(false);
    } else {
      console.log(
        "⚠️ EmployerProfilePage: No authCompany found - attempting to fetch directly"
      );
      // Fallback: Try to fetch company directly if AuthProvider hasn't loaded it
      const fetchCompanyDirectly = async () => {
        try {
          console.log(
            "🔍 EmployerProfilePage: Fetching company directly from database"
          );
          const fetchedCompany = await getCompanyByOwner();
          if (fetchedCompany) {
            console.log("✅ EmployerProfilePage: Company fetched directly", {
              companyId: fetchedCompany.id,
              companyName: fetchedCompany.name,
            });
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
            console.log(
              "⚠️ EmployerProfilePage: No company found in database - will show setup page"
            );
          }
        } catch (error) {
          console.error(
            "❌ EmployerProfilePage: Error fetching company directly:",
            error
          );
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
    console.log("💾 EmployerProfilePage: Saving company", {
      companyId: updatedCompany.id,
      companyName: updatedCompany.companyName,
    });
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
      console.log("🔄 EmployerProfilePage: Refreshing company data");
      await refreshCompany();
      console.log(
        "✅ EmployerProfilePage: Company saved and refreshed successfully"
      );
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error("❌ EmployerProfilePage: Failed to update company:", err);
      setError(err.message || "Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  console.log("🎨 EmployerProfilePage: Render decision", {
    loading,
    hasCompany: !!company,
    companyId: company?.id,
    companyName: company?.companyName,
    isAuthenticated,
    hasAuthCompany: !!authCompany,
  });

  if (loading) {
    console.log("⏳ EmployerProfilePage: Rendering loading state");
    return <PageSkeleton variant="profile" />;
  }

  // If no company exists, redirect to setup
  if (!company) {
    console.log(
      "🚫 EmployerProfilePage: No company found - rendering setup page",
      {
        authCompanyExists: !!authCompany,
        authCompanyId: authCompany?.id,
      }
    );
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

  console.log("✅ EmployerProfilePage: Rendering company profile", {
    companyId: company.id,
    companyName: company.companyName,
  });

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
