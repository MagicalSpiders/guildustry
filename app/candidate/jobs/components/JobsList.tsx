"use client";

import { CandidateJob } from "../data/mockJobs";
import { JobCard } from "./JobCard";

interface JobsListProps {
  jobs: CandidateJob[];
  selectedJobId: string | null;
  onJobSelect: (jobId: string) => void;
}

export function JobsList({
  jobs,
  selectedJobId,
  onJobSelect,
}: JobsListProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-main-text mb-4">
        {jobs.length} Jobs
      </h2>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-main-light-text">
            <p>No jobs found matching your criteria.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJobId === job.id}
              onClick={() => onJobSelect(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

