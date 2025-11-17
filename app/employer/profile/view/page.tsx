"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { CompanyProfile } from "@/app/employer/profile/data/mockCompanyData";
import { useAuth } from "@/src/components/AuthProvider";
import { getCompanyByOwner } from "@/src/lib/companyFunctions";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { useState } from "react";

export default function ViewCompanyProfilePage() {
  const router = useRouter();
  const {
    company: authCompany,
    refreshCompany,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuth();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
          setCompany(uiCompany);
        } else {
          // No company found - redirect to setup
          console.log("[Flow] No company - redirecting to setup");
          router.push("/employer/profile/setup");
        }
      } catch (error: any) {
        console.error("[Company] Load error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [authCompany, authLoading, router, refreshCompany]);

  if (authLoading || loading) {
    return <PageSkeleton variant="profile" />;
  }

  if (!company) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-main-bg via-main-bg to-surface/30">
      {/* Hero Section with Logo */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-surface to-surface/80">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Company Logo */}
            {company.logo_url && (
              <div className="shrink-0 group">
                <div className="relative w-40 h-40 lg:w-56 lg:h-56 rounded-3xl border border-subtle/50 bg-surface/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                  <img
                    src={company.logo_url}
                    alt={`${company.companyName} logo`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
                </div>
              </div>
            )}

            {/* Company Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
                <div className="w-1 h-12 bg-main-accent rounded-full"></div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-bold text-main-text mb-2">
                    {company.companyName}
                  </h1>
                  <p className="text-xl text-main-light-text">
                    {company.industry} • Founded {company.founded}
                  </p>
                </div>
              </div>

              <p className="text-lg text-main-light-text mb-8 max-w-2xl leading-relaxed">
                {company.headquarters} • Building the future of work
              </p>

              {/* Key Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
                <div className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                    <Icon icon="lucide:users" width={36} height={36} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-title text-main-text">
                      {company.members_count || 0}
                    </div>
                    <p className="text-sm text-main-light-text">Team Members</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                    <Icon icon="lucide:calendar" width={36} height={36} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-title text-main-text">
                      {company.stats.yearsInBusiness}
                    </div>
                    <p className="text-sm text-main-light-text">
                      Years in Business
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                    <Icon icon="lucide:briefcase" width={36} height={36} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-title text-main-text">
                      {company.stats.activeJobs}
                    </div>
                    <p className="text-sm text-main-light-text">
                      Active Positions
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => router.push("/employer/profile/edit")}
                  className="shadow-sm hover:shadow-lg transition-all duration-200"
                >
                  <Icon icon="lucide:edit-3" className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/employer/dashboard")}
                  className="border-subtle hover:border-main-accent/50 hover:bg-surface/50 transition-all duration-200"
                >
                  <Icon icon="lucide:arrow-left" className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Details Section */}
      <section className="bg-main-bg text-main-text py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-10">
              {/* Company Description */}
              <div className="group relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-br from-surface via-surface to-surface/50 p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-main-accent/5 via-transparent to-main-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                      <Icon icon="lucide:building-2" width={28} height={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold font-title text-main-text mb-2">
                        About {company.companyName}
                      </h3>
                      <p className="text-main-light-text">
                        Our mission and vision
                      </p>
                    </div>
                  </div>
                  <p className="text-main-light-text leading-relaxed text-lg">
                    {company.description ||
                      "No description provided yet. Tell candidates about your company's story, mission, and what makes you unique."}
                  </p>
                </div>
              </div>

              {/* Specialties */}
              {company.specialties && company.specialties.length > 0 && (
                <div className="group relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-br from-surface via-surface to-surface/50 p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-main-accent/5 via-transparent to-main-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                        <Icon icon="lucide:star" width={28} height={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold font-title text-main-text mb-2">
                          Our Specialties
                        </h3>
                        <p className="text-main-light-text">
                          Areas of expertise and focus
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {company.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-5 py-2.5 rounded-full border border-main-accent/20 bg-main-accent/5 backdrop-blur-sm hover:bg-main-accent/10 hover:border-main-accent/40 transition-all duration-200"
                        >
                          <span className="text-main-accent font-medium">
                            {specialty}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Company Values */}
              {company.values && company.values.length > 0 && (
                <div className="group relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-br from-surface via-surface to-surface/50 p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-main-accent/5 via-transparent to-main-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                        <Icon icon="lucide:heart" width={28} height={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold font-title text-main-text mb-2">
                          Our Values
                        </h3>
                        <p className="text-main-light-text">
                          What drives our company culture
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {company.values.map((value, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 group/item"
                        >
                          <div className="w-3 h-3 rounded-full bg-main-accent group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="text-main-text text-lg group-hover/item:text-main-accent transition-colors duration-200">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-10">
              {/* Benefits */}
              {company.benefits && company.benefits.length > 0 && (
                <div className="group relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-br from-surface via-surface to-surface/50 p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-main-accent/5 via-transparent to-main-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                        <Icon icon="lucide:gift" width={28} height={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold font-title text-main-text mb-2">
                          Benefits & Perks
                        </h3>
                        <p className="text-main-light-text">
                          What we offer our team
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {company.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 group/item"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500 group-hover/item:bg-green-500/20 transition-colors duration-200">
                            <Icon icon="lucide:check" className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-main-text text-lg group-hover/item:text-main-accent transition-colors duration-200">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="group relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-br from-surface via-surface to-surface/50 p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-main-accent/5 via-transparent to-main-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                      <Icon icon="lucide:mail" width={28} height={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold font-title text-main-text mb-2">
                        Contact Information
                      </h3>
                      <p className="text-main-light-text">
                        Get in touch with us
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 group/item">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-main-accent/10 text-main-accent group-hover/item:bg-main-accent/20 transition-colors duration-200">
                        <Icon icon="lucide:mail" className="w-5 h-5" />
                      </div>
                      <span className="text-main-text text-lg group-hover/item:text-main-accent transition-colors duration-200">
                        {company.contact.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-main-accent/10 text-main-accent group-hover/item:bg-main-accent/20 transition-colors duration-200">
                        <Icon icon="lucide:phone" className="w-5 h-5" />
                      </div>
                      <span className="text-main-text text-lg group-hover/item:text-main-accent transition-colors duration-200">
                        {company.contact.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-main-accent/10 text-main-accent group-hover/item:bg-main-accent/20 transition-colors duration-200">
                        <Icon icon="lucide:map-pin" className="w-5 h-5" />
                      </div>
                      <span className="text-main-text text-lg group-hover/item:text-main-accent transition-colors duration-200">
                        {company.contact.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {(company.socialMedia?.linkedin ||
                company.socialMedia?.twitter ||
                company.socialMedia?.facebook) && (
                <div className="group relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-br from-surface via-surface to-surface/50 p-8 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-main-accent/5 via-transparent to-main-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-main-accent/10 text-main-accent shadow-sm group-hover:shadow-md transition-all duration-200">
                        <Icon icon="lucide:share-2" width={28} height={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold font-title text-main-text mb-2">
                          Connect With Us
                        </h3>
                        <p className="text-main-light-text">
                          Follow us on social media
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {company.socialMedia?.linkedin && (
                        <a
                          href={`https://${company.socialMedia.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <Icon icon="lucide:linkedin" width={24} height={24} />
                        </a>
                      )}
                      {company.socialMedia?.twitter && (
                        <a
                          href={`https://${company.socialMedia.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <Icon icon="lucide:twitter" width={24} height={24} />
                        </a>
                      )}
                      {company.socialMedia?.facebook && (
                        <a
                          href={`https://${company.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <Icon icon="lucide:facebook" width={24} height={24} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-20 text-center">
            <div className="relative overflow-hidden rounded-3xl border border-subtle/60 bg-gradient-to-r from-surface via-surface to-surface/80 backdrop-blur-sm p-10 shadow-lg hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-main-accent/5 via-transparent to-main-accent/5 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-green-500/10 text-green-500 shadow-sm">
                    <Icon icon="lucide:check-circle-2" className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold font-title text-main-text mb-1">
                      Profile Complete
                    </h3>
                    <p className="text-main-light-text">
                      Your company profile is ready to attract top talent
                    </p>
                  </div>
                </div>
                <p className="text-main-light-text text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                  Showcase your company's story, values, and opportunities. Your
                  profile is now optimized to attract the best candidates in
                  your industry and build lasting connections.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => router.push("/employer/jobs")}
                    className="shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    <Icon icon="lucide:briefcase" className="w-5 h-5 mr-2" />
                    Manage Jobs
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => router.push("/employer/dashboard")}
                    className="border-subtle hover:border-main-accent/50 hover:bg-surface/50 transition-all duration-200"
                  >
                    <Icon
                      icon="lucide:layout-dashboard"
                      className="w-5 h-5 mr-2"
                    />
                    Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
