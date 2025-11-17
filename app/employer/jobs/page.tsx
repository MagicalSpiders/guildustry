"use client";

import { useState, useMemo, useEffect } from "react";
import { JobsHeader } from "@/app/employer/jobs/components/JobsHeader";
import { JobsStats } from "@/app/employer/jobs/components/JobsStats";
import { SearchAndFilters } from "@/app/employer/jobs/components/SearchAndFilters";
import { JobsTabs } from "@/app/employer/jobs/components/JobsTabs";
import { JobsList } from "@/app/employer/jobs/components/JobsList";
import { JobDetails } from "@/app/employer/jobs/components/JobDetails";
import { Job } from "@/app/employer/jobs/components/JobCard";
import { getOwnJobs } from "@/src/lib/jobsFunctions";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { getCompanyByOwner } from "@/src/lib/companyFunctions";

export default function EmployerJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    trade: "All Trades",
    location: "All Locations",
    salary: "All Salaries",
    type: "All Types",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      if (authLoading) return;
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const dbJobs = await getOwnJobs();
        const company = await getCompanyByOwner();
        
        // Transform database jobs to Job format
        const transformedJobs: Job[] = dbJobs.map((job) => {
          const postedDate = new Date(job.posted_date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - postedDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          let postedText = "";
          if (diffDays === 0) {
            postedText = "Today";
          } else if (diffDays === 1) {
            postedText = "1 day ago";
          } else if (diffDays < 7) {
            postedText = `${diffDays} days ago`;
          } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            postedText = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
          } else {
            const months = Math.floor(diffDays / 30);
            postedText = `${months} month${months > 1 ? "s" : ""} ago`;
          }

          return {
            id: job.id,
            title: job.title,
            company: company?.name || "My Company",
            location: job.location,
            salary: `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`,
            posted: postedText,
            status: job.status as "active" | "closed" | null,
            isMyPost: true,
            applicants: 0, // TODO: Fetch applicant count
          };
        });

        setJobs(transformedJobs);
        
        // Auto-select first job
        if (transformedJobs.length > 0 && !selectedJobId) {
          setSelectedJobId(transformedJobs[0].id);
        }
      } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, authLoading]);

  // Filter jobs based on search, filters, and tab
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

    // Tab filter
    switch (activeTab) {
      case "myPosts":
        filtered = filtered.filter((job) => job.isMyPost);
        break;
      case "available":
        filtered = filtered.filter((job) => !job.isMyPost && job.status === "active");
        break;
      case "active":
        filtered = filtered.filter((job) => job.status === "active");
        break;
      case "drafts":
        filtered = filtered.filter((job) => job.status === null || job.status === undefined);
        break;
      default:
        // "all" - no filter
        break;
    }

    // Filter dropdowns
    if (filters.trade !== "All Trades") {
      // In a real app, you'd filter by trade specialty
      // For now, we'll skip this or filter by title keywords
    }
    if (filters.location !== "All Locations") {
      filtered = filtered.filter((job) => job.location.includes(filters.location.replace("All Locations", "").trim()));
    }
    if (filters.salary !== "All Salaries") {
      // Parse salary range and filter
      // For now, we'll skip this
    }
    if (filters.type !== "All Types") {
      // Filter by employment type
      // For now, we'll skip this
    }

    return filtered;
  }, [searchQuery, filters, activeTab, jobs]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const myPosts = jobs.filter((job) => job.isMyPost).length;
    const available = jobs.filter((job) => !job.isMyPost && job.status === "active").length;
    const active = jobs.filter((job) => job.status === "active").length;
    const drafts = jobs.filter((job) => job.status === null || job.status === undefined).length;

    return {
      all: jobs.length,
      myPosts,
      available,
      active,
      drafts,
    };
  }, [jobs]);

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) || null;

  // Auto-select first job if current selection is not in filtered list
  useEffect(() => {
    if (selectedJobId && !selectedJob && filteredJobs.length > 0) {
      setSelectedJobId(filteredJobs[0].id);
    } else if (!selectedJobId && filteredJobs.length > 0) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [selectedJobId, selectedJob, filteredJobs]);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  if (loading || authLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-main-bg text-main-text flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-main-accent text-main-bg rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <JobsHeader />
        <JobsStats />

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <JobsTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

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
            <JobDetails job={selectedJob} />
          </div>
        </div>
      </div>
    </div>
  );
}
