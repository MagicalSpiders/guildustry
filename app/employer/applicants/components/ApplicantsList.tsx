"use client";

import { Applicant, ApplicantCard } from "./ApplicantCard";

interface ApplicantsListProps {
  applicants: Applicant[];
  onStatusUpdate?: (applicantId: string, newStatus: Applicant["status"]) => void;
}

export function ApplicantsList({ applicants, onStatusUpdate }: ApplicantsListProps) {
  return (
    <div className="space-y-4">
      {applicants.length === 0 ? (
        <div className="text-center py-12 text-main-light-text">
          <p>No applicants found matching your criteria.</p>
        </div>
      ) : (
        applicants.map((applicant) => (
          <ApplicantCard
            key={applicant.id}
            applicant={applicant}
            onStatusUpdate={onStatusUpdate}
          />
        ))
      )}
    </div>
  );
}

