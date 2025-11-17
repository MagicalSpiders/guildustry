"use client";

import { Icon } from "@iconify/react";
import { Job } from "./JobCard";

interface JobDetailsProps {
  job: Job | null;
}

export function JobDetails({ job }: JobDetailsProps) {
  if (!job) {
    return (
      <div className="rounded-lg bg-surface border border-subtle p-8 text-center">
        <Icon icon="lucide:briefcase" className="w-16 h-16 text-main-light-text mx-auto mb-4" />
        <p className="text-main-light-text">Select a job to view details</p>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (job.status) {
      case "active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Active
          </span>
        );
      case null:
      case undefined:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Pending Approval
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-title text-main-text mb-2">
              {job.title}
            </h2>
            {job.isMyPost && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-subtle text-main-light-text mb-3">
                <Icon icon="lucide:building-2" className="w-3 h-3" />
                My Post
              </span>
            )}
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-main-light-text">
            <Icon icon="lucide:building-2" className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center gap-2 text-main-light-text">
            <Icon icon="lucide:map-pin" className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-main-light-text">
            <Icon icon="lucide:dollar-sign" className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-main-light-text">
            <Icon icon="lucide:clock" className="w-4 h-4" />
            <span>{job.posted}</span>
          </div>
        </div>
      </div>

      {/* Job Performance */}
      {job.applicants !== undefined && (
        <div className="rounded-lg bg-light-bg border border-subtle p-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="lucide:users" className="w-5 h-5 text-main-accent" />
            <h3 className="font-semibold text-main-text">Job Performance</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold font-title text-main-text">
                {job.applicants}
              </div>
              <p className="text-sm text-main-light-text">Applicants</p>
            </div>
            <div>
              <div className="text-2xl font-bold font-title text-main-text">245</div>
              <p className="text-sm text-main-light-text">Views</p>
            </div>
            <div>
              <div className="text-2xl font-bold font-title text-main-text">5%</div>
              <p className="text-sm text-main-light-text">Conversion</p>
            </div>
          </div>
        </div>
      )}

      {/* Job Overview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:briefcase" className="w-5 h-5 text-main-accent" />
          <h3 className="font-semibold text-main-text">Job Overview</h3>
        </div>
        <p className="text-main-light-text leading-relaxed">
          Seeking experienced {job.title.toLowerCase()} for commercial projects. Must have valid license and OSHA certification.
        </p>
      </div>

      {/* Job Requirements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:target" className="w-5 h-5 text-main-accent" />
          <h3 className="font-semibold text-main-text">Job Requirements</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-main-light-text mb-1">Education Required:</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              High School
            </span>
          </div>
          <div>
            <p className="text-sm text-main-light-text mb-1">Employment Type:</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Full-time
            </span>
          </div>
          <div>
            <p className="text-sm text-main-light-text mb-1">Shift Pattern:</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Day Shift
            </span>
          </div>
          <div>
            <p className="text-sm text-main-light-text mb-1">Transportation:</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              License & Vehicle Required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

