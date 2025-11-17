"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";

interface Applicant {
  id: string;
  name: string;
  position: string;
  experience: string;
  status:
    | "new"
    | "underReview"
    | "interviewScheduled"
    | "shortlisted"
    | "rejected";
}

interface RecentApplicantsProps {
  applicants: Applicant[];
}

function ApplicantCard({ applicant }: { applicant: Applicant }) {
  const getStatusBadge = () => {
    const statusConfig = {
      new: {
        label: "New",
        className: "bg-surface border border-subtle text-main-light-text",
      },
      underReview: {
        label: "Under Review",
        className: "bg-surface border border-subtle text-main-light-text",
      },
      interviewScheduled: {
        label: "Interview Scheduled",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      shortlisted: {
        label: "Shortlisted",
        className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      },
    };

    const config = statusConfig[applicant.status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="rounded-lg bg-surface border border-subtle p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-main-text mb-1">
            {applicant.name}
          </h3>
          <p className="text-sm text-main-light-text mb-2">
            {applicant.position}
          </p>
          <span className="text-xs text-main-light-text">
            {applicant.experience}
          </span>
        </div>
        {getStatusBadge()}
      </div>
    </div>
  );
}

export function RecentApplicants({ applicants }: RecentApplicantsProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-title font-bold text-main-text mb-2">
          Recent Applicants
        </h2>
        <p className="text-main-light-text">
          Latest candidates who have applied to your positions
        </p>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        {applicants.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} />
        ))}
      </div>

      <div className="mt-auto">
        <Link href="/employer/applicants">
          <Button variant="outline" className="w-full">
            View All Applicants
          </Button>
        </Link>
      </div>
    </div>
  );
}
