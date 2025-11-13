"use client";

import { useState, useMemo } from "react";
import { JobsHeader } from "@/app/employer/jobs/components/JobsHeader";
import { JobsStats } from "@/app/employer/jobs/components/JobsStats";
import { SearchAndFilters } from "@/app/employer/jobs/components/SearchAndFilters";
import { JobsTabs } from "@/app/employer/jobs/components/JobsTabs";
import { JobsList } from "@/app/employer/jobs/components/JobsList";
import { JobDetails } from "@/app/employer/jobs/components/JobDetails";
import { Job } from "@/app/employer/jobs/components/JobCard";

// Mock data - replace with API call
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Licensed Electrician",
    company: "My Company",
    location: "New York, NY",
    salary: "$65,000 - $85,000",
    posted: "5 days ago",
    status: "active",
    isMyPost: true,
    applicants: 12,
  },
  {
    id: "2",
    title: "Master Plumber",
    company: "My Company",
    location: "Brooklyn, NY",
    salary: "$70,000 - $90,000",
    posted: "3 days ago",
    status: "active",
    isMyPost: true,
    applicants: 8,
  },
  {
    id: "3",
    title: "Construction Supervisor",
    company: "My Company",
    location: "Manhattan, NY",
    salary: "$75,000 - $95,000",
    posted: "1 week ago",
    status: "draft",
    isMyPost: true,
  },
  {
    id: "4",
    title: "Licensed Electrician",
    company: "ABC Construction",
    location: "New York, NY",
    salary: "$60,000 - $80,000",
    posted: "2 days ago",
    status: "active",
    isMyPost: false,
    matchScore: 92,
  },
  {
    id: "5",
    title: "HVAC Technician",
    company: "CoolAir Systems",
    location: "Queens, NY",
    salary: "$55,000 - $75,000",
    posted: "4 days ago",
    status: "active",
    isMyPost: false,
    matchScore: 85,
  },
  {
    id: "6",
    title: "Welder",
    company: "MetalWorks Inc",
    location: "Brooklyn, NY",
    salary: "$50,000 - $70,000",
    posted: "6 days ago",
    status: "active",
    isMyPost: false,
    matchScore: 78,
  },
  {
    id: "7",
    title: "Carpenter",
    company: "BuildRight LLC",
    location: "Manhattan, NY",
    salary: "$58,000 - $78,000",
    posted: "1 week ago",
    status: "active",
    isMyPost: false,
    matchScore: 88,
  },
  {
    id: "8",
    title: "Plumber",
    company: "PipeDreams Co",
    location: "New York, NY",
    salary: "$62,000 - $82,000",
    posted: "3 days ago",
    status: "active",
    isMyPost: false,
    matchScore: 90,
  },
];

export default function EmployerJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    trade: "All Trades",
    location: "All Locations",
    salary: "All Salaries",
    type: "All Types",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(mockJobs[0]?.id || null);

  // Filter jobs based on search, filters, and tab
  const filteredJobs = useMemo(() => {
    let filtered = [...mockJobs];

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
        filtered = filtered.filter((job) => job.status === "draft");
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
  }, [searchQuery, filters, activeTab]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const myPosts = mockJobs.filter((job) => job.isMyPost).length;
    const available = mockJobs.filter((job) => !job.isMyPost && job.status === "active").length;
    const active = mockJobs.filter((job) => job.status === "active").length;
    const drafts = mockJobs.filter((job) => job.status === "draft").length;

    return {
      all: mockJobs.length,
      myPosts,
      available,
      active,
      drafts,
    };
  }, []);

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) || null;

  // Auto-select first job if current selection is not in filtered list
  if (selectedJobId && !selectedJob && filteredJobs.length > 0) {
    setSelectedJobId(filteredJobs[0].id);
  }

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

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

