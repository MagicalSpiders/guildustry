"use client";

import { Icon } from "@iconify/react";

interface ApplicantsSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedJob: string;
  onJobChange: (job: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  jobs: string[];
}

export function ApplicantsSearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedJob,
  onJobChange,
  selectedStatus,
  onStatusChange,
  jobs,
}: ApplicantsSearchAndFiltersProps) {
  const statusOptions = [
    "All Status",
    "Pending",
    "Reviewed",
    "Accepted",
    "Rejected",
    "Withdrawn",
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Icon
          icon="lucide:search"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text"
        />
        <input
          type="text"
          placeholder="Search by name or position..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex gap-4">
        <div className="relative min-w-[150px]">
          <select
            value={selectedJob}
            onChange={(e) => onJobChange(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors appearance-none cursor-pointer"
          >
            {jobs.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
          <Icon
            icon="lucide:chevron-down"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text pointer-events-none"
          />
        </div>

        <div className="relative min-w-[150px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors appearance-none cursor-pointer"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Icon
            icon="lucide:chevron-down"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

