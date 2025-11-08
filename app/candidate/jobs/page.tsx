"use client";

import { useState, useMemo } from "react";
import { JobsHeader } from "@/src/app/candidate/jobs/components/JobsHeader";
import { JobsStats } from "@/src/app/candidate/jobs/components/JobsStats";
import { SearchAndFilters } from "@/src/app/candidate/jobs/components/SearchAndFilters";
import { JobsList } from "@/src/app/candidate/jobs/components/JobsList";
import { JobDetails } from "@/src/app/candidate/jobs/components/JobDetails";
import { mockJobs, CandidateJob } from "@/src/app/candidate/jobs/data/mockJobs";

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<CandidateJob[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    trade: "All Trades",
    location: "All Locations",
    salary: "All Salaries",
    type: "All Types",
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    jobs[0]?.id || null
  );

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

  const handleApply = (jobId: string) => {
    // In a real app, this would make an API call
    console.log("Applying to job:", jobId);
    // Update the job to mark as applied
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, hasApplied: true } : job
      )
    );
    // Keep the selected job visible
    setSelectedJobId(jobId);
  };

  return (
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

        {/* Two Column Layout */}
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
      </div>
    </div>
  );
}

