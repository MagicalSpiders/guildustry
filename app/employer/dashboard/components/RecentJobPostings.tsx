"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";

interface JobPosting {
  id: string;
  title: string;
  location: string;
  postedDate: string;
  applicantsCount: number;
  status: "active" | "closed" | null;
}

interface RecentJobPostingsProps {
  jobs: JobPosting[];
}

function JobPostingCard({ job }: { job: JobPosting }) {
  const getStatusBadge = () => {
    switch (job.status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 whitespace-nowrap">
            Active
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
            Closed
          </span>
        );
      case null:
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 whitespace-nowrap">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-lg bg-surface border border-subtle p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-main-text mb-1">{job.title}</h3>
          <p className="text-sm text-main-light-text mb-2">{job.location}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-main-light-text">
              Posted {job.postedDate}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-subtle text-main-light-text">
              {job.applicantsCount} applicants
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>
    </div>
  );
}

export function RecentJobPostings({ jobs }: RecentJobPostingsProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-title font-bold text-main-text mb-2">
          Recent Job Postings
        </h2>
        <p className="text-main-light-text">
          Your most recent job listings and their performance
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {jobs.map((job) => (
          <JobPostingCard key={job.id} job={job} />
        ))}
      </div>

      <Link href="/employer/jobs">
        <Button variant="outline" className="w-full">
          View All Jobs
        </Button>
      </Link>
    </div>
  );
}
