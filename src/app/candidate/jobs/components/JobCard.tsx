"use client";

import { Icon } from "@iconify/react";
import { CandidateJob } from "../data/mockJobs";

interface JobCardProps {
  job: CandidateJob;
  isSelected: boolean;
  onClick: () => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 80) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (score >= 70) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-4 cursor-pointer transition-all ${
        isSelected
          ? "bg-main-accent/10 border-main-accent shadow-lg"
          : "bg-surface border-subtle hover:shadow-md hover:border-main-accent/50"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-main-text mb-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-main-light-text mb-1">
            <Icon icon="lucide:building-2" className="w-4 h-4" />
            {job.company}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMatchScoreColor(
              job.matchScore
            )}`}
          >
            {job.matchScore}% Match
          </span>
          {job.hasApplied && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-main-accent/20 text-main-accent border border-main-accent/30">
              <Icon icon="lucide:check" className="w-3 h-3" />
              Applied
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-main-light-text">
          <Icon icon="lucide:map-pin" className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-main-light-text">
          <Icon icon="lucide:dollar-sign" className="w-4 h-4" />
          {job.salary}
        </div>
        <div className="flex items-center gap-2 text-sm text-main-light-text">
          <Icon icon="lucide:clock" className="w-4 h-4" />
          {job.posted}
        </div>
      </div>
    </div>
  );
}

