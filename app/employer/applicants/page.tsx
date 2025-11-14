"use client";

import { useState, useMemo, useEffect } from "react";
import { ApplicantsHeader } from "@/app/employer/applicants/components/ApplicantsHeader";
import { ApplicantsStats } from "@/app/employer/applicants/components/ApplicantsStats";
import { ApplicantsSearchAndFilters } from "@/app/employer/applicants/components/ApplicantsSearchAndFilters";
import { ApplicantsTabs } from "@/app/employer/applicants/components/ApplicantsTabs";
import { ApplicantsList } from "@/app/employer/applicants/components/ApplicantsList";
import { Applicant } from "@/app/employer/applicants/components/ApplicantCard";
import { getApplicationsForEmployer, updateApplication, ApplicationWithRelations } from "@/src/lib/applicationsFunctions";
import { NoticeModal } from "@/src/components/NoticeModal";

// Map backend status to UI status
const mapStatus = (status: string): Applicant["status"] => {
  const statusMap: Record<string, Applicant["status"]> = {
    pending: "new",
    underReview: "underReview",
    shortlisted: "shortlisted",
    interviewScheduled: "interviewScheduled",
    rejected: "rejected",
  };
  return statusMap[status] || "new";
};

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noticeModal, setNoticeModal] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant: "success" | "error" | "info";
  }>({
    open: false,
    title: "",
    variant: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("All Jobs");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        setNoticeModal({
          open: true,
          title: "Loading Applicants...",
          description: "Please wait while we fetch applicant data.",
          variant: "info",
        });

        const apps = await getApplicationsForEmployer();

        // Transform ApplicationWithRelations to Applicant format
        const transformedApplicants: Applicant[] = apps.map((app) => {
          const profile = app.candidate_profile;
          const job = app.jobs;
          const submittedDate = new Date(app.submitted_at);
          const formattedDate = submittedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return {
            id: app.id,
            name: profile?.fullname || "Unknown Candidate",
            status: mapStatus(app.status),
            jobTitle: job?.title || "Unknown Position",
            location: `${profile?.city || ""}, ${profile?.state || ""}`.trim() || job?.location || "Unknown Location",
            experience: profile?.years_of_experience
              ? `${profile.years_of_experience} years`
              : "Not specified",
            rating: 4.5, // Placeholder - not in database
            appliedDate: formattedDate,
            education: "Not specified", // Placeholder - not in database
            employmentType: job?.job_type || "Not specified",
            shiftPattern: profile?.shift_preference || "Not specified",
            transportation: profile?.has_valid_licence
              ? "Has License & Vehicle"
              : "No License/Vehicle",
            skills: job?.skills?.map((skill) => ({ name: skill, matched: true })) || [],
            certifications: [], // Placeholder - not in database
            assessment: {
              overall: 85, // Placeholder
              technicalAptitude: 85,
              problemSolving: 85,
              safetyAwareness: 85,
              adaptability: 85,
            },
          };
        });

        setApplicants(transformedApplicants);
        setNoticeModal({ open: false, title: "", variant: "info" });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to load applicants. Please try again later.";
        setError(errorMessage);
        setNoticeModal({
          open: true,
          title: "Error Loading Applicants",
          description: errorMessage,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant["status"]) => {
    try {
      setNoticeModal({
        open: true,
        title: "Updating Status...",
        description: "Please wait while we update the application status.",
        variant: "info",
      });

      // Map UI status back to backend status
      const statusMap: Record<Applicant["status"], string> = {
        new: "pending",
        underReview: "underReview",
        shortlisted: "shortlisted",
        interviewScheduled: "interviewScheduled",
        rejected: "rejected",
      };

      await updateApplication(applicantId, {
        status: statusMap[newStatus],
      });

      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicantId ? { ...app, status: newStatus } : app
        )
      );

      setNoticeModal({
        open: true,
        title: "Status Updated",
        description: "Application status has been updated successfully.",
        variant: "success",
      });

      setTimeout(() => {
        setNoticeModal({ open: false, title: "", variant: "info" });
      }, 2000);
    } catch (err: any) {
      setNoticeModal({
        open: true,
        title: "Update Failed",
        description: err.message || "Failed to update status. Please try again.",
        variant: "error",
      });
    }
  };

  // Get unique jobs for filter
  const availableJobs = useMemo(() => {
    const jobs = new Set(applicants.map((app) => app.jobTitle));
    return ["All Jobs", ...Array.from(jobs)];
  }, [applicants]);

  // Filter applicants based on search, filters, and tab
  const filteredApplicants = useMemo(() => {
    let filtered = [...applicants];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.jobTitle.toLowerCase().includes(query)
      );
    }

    // Job filter
    if (selectedJob !== "All Jobs") {
      filtered = filtered.filter((app) => app.jobTitle === selectedJob);
    }

    // Status filter
    if (selectedStatus !== "All Status") {
      const statusMap: Record<string, Applicant["status"]> = {
        "New": "new",
        "Under Review": "underReview",
        "Shortlisted": "shortlisted",
        "Interview Scheduled": "interviewScheduled",
        "Rejected": "rejected",
      };
      const status = statusMap[selectedStatus];
      if (status) {
        filtered = filtered.filter((app) => app.status === status);
      }
    }

    // Tab filter
    switch (activeTab) {
      case "new":
        filtered = filtered.filter((app) => app.status === "new");
        break;
      case "underReview":
        filtered = filtered.filter((app) => app.status === "underReview");
        break;
      case "shortlisted":
        filtered = filtered.filter((app) => app.status === "shortlisted");
        break;
      case "interviews":
        filtered = filtered.filter((app) => app.status === "interviewScheduled");
        break;
      default:
        // "all" - no filter
        break;
    }

    return filtered;
  }, [applicants, searchQuery, selectedJob, selectedStatus, activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: applicants.length,
      new: applicants.filter((app) => app.status === "new").length,
      interviews: applicants.filter((app) => app.status === "interviewScheduled").length,
      shortlisted: applicants.filter((app) => app.status === "shortlisted").length,
    };
  }, [applicants]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    return {
      all: applicants.length,
      new: applicants.filter((app) => app.status === "new").length,
      underReview: applicants.filter((app) => app.status === "underReview").length,
      shortlisted: applicants.filter((app) => app.status === "shortlisted").length,
      interviews: applicants.filter((app) => app.status === "interviewScheduled").length,
    };
  }, [applicants]);

  return (
    <>
      <NoticeModal
        open={noticeModal.open}
        title={noticeModal.title}
        description={noticeModal.description}
        variant={noticeModal.variant}
        onClose={() =>
          setNoticeModal({ open: false, title: "", variant: "info" })
        }
        primaryAction={
          noticeModal.variant === "error"
            ? {
                label: "Retry",
                onClick: () => {
                  setNoticeModal({ open: false, title: "", variant: "info" });
                  window.location.reload();
                },
              }
            : undefined
        }
      />

      <div className="min-h-screen bg-main-bg text-main-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <ApplicantsHeader />
          <ApplicantsStats
            total={stats.total}
            new={stats.new}
            interviews={stats.interviews}
            shortlisted={stats.shortlisted}
          />

          <ApplicantsSearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedJob={selectedJob}
            onJobChange={setSelectedJob}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            jobs={availableJobs}
          />

          <ApplicantsTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

          {loading ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">Loading applicants...</p>
            </div>
          ) : (
            <ApplicantsList
              applicants={filteredApplicants}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
}

