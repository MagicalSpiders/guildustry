"use client";

import { Icon } from "@iconify/react";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  status: "active" | "draft" | "pending";
  isMyPost: boolean;
  applicants?: number;
  matchScore?: number;
}

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const getStatusBadge = () => {
    switch (job.status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Active
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-subtle text-main-light-text">
            Draft
          </span>
        );
      default:
        return null;
    }
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
          {job.isMyPost && (
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-subtle text-main-light-text">
                <Icon icon="lucide:building-2" className="w-3 h-3" />
                My Post
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-main-light-text mb-1">
            <Icon icon="lucide:building-2" className="w-4 h-4" />
            {job.company}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge()}
          {job.applicants !== undefined && (
            <span className="text-xs text-main-light-text">
              {job.applicants} applicants
            </span>
          )}
          {job.matchScore !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {job.matchScore}%
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

