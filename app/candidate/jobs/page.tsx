"use client";

import { useState, useMemo, useEffect } from "react";
import { JobsHeader } from "@/app/candidate/jobs/components/JobsHeader";
import { JobsStats } from "@/app/candidate/jobs/components/JobsStats";
import { SearchAndFilters } from "@/app/candidate/jobs/components/SearchAndFilters";
import { JobsList } from "@/app/candidate/jobs/components/JobsList";
import { JobDetails } from "@/app/candidate/jobs/components/JobDetails";
import { CandidateJob } from "@/app/candidate/jobs/data/mockJobs";
import { getOpenJobs, JobWithCompany } from "@/src/lib/jobsFunctions";
import { getOwnApplications } from "@/src/lib/applicationsFunctions";
import { NoticeModal } from "@/src/components/NoticeModal";

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<CandidateJob[]>([]);
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
  const [filters, setFilters] = useState({
    trade: "All Trades",
    location: "All Locations",
    salary: "All Salaries",
    type: "All Types",
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch jobs and check applied status
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Show loading modal
        setNoticeModal({
          open: true,
          title: "Loading Jobs...",
          description: "Please wait while we fetch available job listings.",
          variant: "info",
        });

        // Fetch open jobs
        const openJobs = await getOpenJobs();

        // Fetch user's applications to check which jobs they've applied to
        let appliedJobIds: string[] = [];
        try {
          const applications = await getOwnApplications();
          appliedJobIds = applications.map((app) => app.job_id);
        } catch (appError) {
          // If user is not authenticated or has no applications, that's okay
          console.log("Could not fetch applications:", appError);
        }

        // Transform JobWithCompany to CandidateJob format
        const transformedJobs: CandidateJob[] = openJobs.map((job) => {
          const postedDate = new Date(job.posted_date);
          const now = new Date();
          const daysDiff = Math.floor(
            (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const postedText =
            daysDiff === 0
              ? "Today"
              : daysDiff === 1
              ? "1 day ago"
              : `${daysDiff} days ago`;

          // Calculate a simple match score (placeholder - you can enhance this)
          const matchScore = Math.floor(Math.random() * 20) + 80; // 80-100 for demo

          return {
            id: job.id,
            title: job.title,
            company: job.company?.name || "Unknown Company",
            location: job.location,
            salary: `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`,
            posted: postedText,
            status: job.status as "active" | "draft" | "pending",
            matchScore,
            tradeSpecialty: job.trade_specialty,
            employmentType: job.job_type,
            shiftPattern: "Day Shift", // Not in job data, using default
            startDate: new Date().toISOString(), // Not in job data, using current date
            requiredCertifications: [], // Not in job data
            prioritySkills: job.skills || [],
            minimumEducation: "High School Diploma/GED", // Not in job data
            transportationRequired: "Driver's license & own vehicle required", // Not in job data
            description: job.description,
            hasApplied: appliedJobIds.includes(job.id),
          };
        });

        setJobs(transformedJobs);
        if (transformedJobs.length > 0) {
          setSelectedJobId(transformedJobs[0].id);
        }

        // Close loading modal
        setNoticeModal({ open: false, title: "", variant: "info" });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to load jobs. Please try again later.";
        setError(errorMessage);
        setNoticeModal({
          open: true,
          title: "Error Loading Jobs",
          description: errorMessage,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // Filter dropdowns
    if (filters.trade !== "All Trades") {
      filtered = filtered.filter(
        (job) => job.tradeSpecialty === filters.trade
      );
    }
    if (filters.location !== "All Locations") {
      filtered = filtered.filter((job) =>
        job.location.includes(
          filters.location.replace("All Locations", "").trim()
        )
      );
    }
    if (filters.salary !== "All Salaries") {
      // Parse salary range and filter
      // For now, we'll skip this or implement basic filtering
    }
    if (filters.type !== "All Types") {
      filtered = filtered.filter((job) => job.employmentType === filters.type);
    }

    // Sort by match score (highest first)
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    return filtered;
  }, [jobs, searchQuery, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalJobs = filteredJobs.length;
    const highMatchJobs = filteredJobs.filter((job) => job.matchScore >= 90)
      .length;
    const appliedJobs = filteredJobs.filter((job) => job.hasApplied).length;
    const newJobs = filteredJobs.filter((job) => {
      const postedDays = parseInt(job.posted.replace(/\D/g, ""));
      return postedDays <= 7;
    }).length;

    return {
      totalJobs,
      highMatchJobs,
      appliedJobs,
      newJobs,
    };
  }, [filteredJobs]);

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedJobId) || null;

  // Auto-select first job if current selection is not in filtered list
  if (selectedJobId && !selectedJob && filteredJobs.length > 0) {
    setSelectedJobId(filteredJobs[0].id);
  }

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const handleApply = async (jobId: string) => {
    // Refresh applications to update hasApplied status
    try {
      const applications = await getOwnApplications();
      const appliedJobIds = applications.map((app) => app.job_id);
      
      // Update the job to mark as applied
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, hasApplied: true } : job
        )
      );
      // Keep the selected job visible
      setSelectedJobId(jobId);
    } catch (error) {
      console.error("Failed to refresh applications:", error);
    }
  };

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
          <JobsHeader />
          <JobsStats {...stats} />

          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">
                {error
                  ? "Failed to load jobs. Please try again."
                  : "No jobs found matching your criteria."}
              </p>
            </div>
          ) : (
            /* Two Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Job Listings */}
              <div className="lg:max-h-[600px]">
                <JobsList
                  jobs={filteredJobs}
                  selectedJobId={selectedJobId}
                  onJobSelect={setSelectedJobId}
                />
              </div>

              {/* Right: Job Details */}
              <div className="lg:max-h-[600px] lg:overflow-y-auto">
                <JobDetails job={selectedJob} onApply={handleApply} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

