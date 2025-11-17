"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { ScheduleInterviewModal } from "./ScheduleInterviewModal";

export interface Applicant {
  id: string;
  name: string;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "withdrawn";
  jobTitle: string;
  location: string;
  experience: string;
  rating: number;
  appliedDate: string;
  education: string;
  employmentType: string;
  shiftPattern: string;
  transportation: string;
  skills: { name: string; matched: boolean }[];
  certifications: { name: string; matched: boolean }[];
  assessment?: {
    overall: number;
    technicalAptitude?: number;
    problemSolving?: number;
    safetyAwareness?: number;
    adaptability?: number;
  };
}

interface ApplicantCardProps {
  applicant: Applicant;
  onStatusUpdate?: (
    applicantId: string,
    newStatus: Applicant["status"]
  ) => void;
}

export function ApplicantCard({
  applicant,
  onStatusUpdate,
}: ApplicantCardProps) {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleInterviewScheduled = () => {
    // Update status to reviewed (interview will be scheduled)
    onStatusUpdate?.(applicant.id, "reviewed");
    setIsScheduleModalOpen(false);
  };
  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      },
      reviewed: {
        label: "Reviewed",
        className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      },
      accepted: {
        label: "Accepted",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      },
      withdrawn: {
        label: "Withdrawn",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
    };

    const config = statusConfig[applicant.status];

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-main-accent/10 flex items-center justify-center">
            <Icon icon="lucide:user" className="w-6 h-6 text-main-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-main-text">
                {applicant.name}
              </h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-main-light-text mb-3">
              Applied for:{" "}
              <span className="font-medium text-main-text">
                {applicant.jobTitle}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-main-light-text">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:map-pin" className="w-4 h-4" />
                {applicant.location}
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:briefcase" className="w-4 h-4" />
                {applicant.experience}
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:star" className="w-4 h-4 text-main-accent" />
                {applicant.rating}
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:clock" className="w-4 h-4" />
                Applied {applicant.appliedDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-main-light-text mb-2">Education:</p>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <Icon icon="lucide:check" className="w-3 h-3 mr-1" />
            {applicant.education}
          </span>
        </div>
        <div>
          <p className="text-sm text-main-light-text mb-2">Type:</p>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <Icon icon="lucide:check" className="w-3 h-3 mr-1" />
            {applicant.employmentType}
          </span>
        </div>
        <div>
          <p className="text-sm text-main-light-text mb-2">Shift:</p>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <Icon icon="lucide:check" className="w-3 h-3 mr-1" />
            {applicant.shiftPattern}
          </span>
        </div>
        <div>
          <p className="text-sm text-main-light-text mb-2">Transport:</p>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <Icon icon="lucide:check" className="w-3 h-3 mr-1" />
            {applicant.transportation}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:zap" className="w-5 h-5 text-main-accent" />
          <h4 className="font-semibold text-main-text">Skills</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {applicant.skills.map((skill, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                skill.matched
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {skill.matched ? (
                <Icon icon="lucide:check" className="w-3 h-3 mr-1" />
              ) : (
                <Icon icon="lucide:x" className="w-3 h-3 mr-1" />
              )}
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:award" className="w-5 h-5 text-main-accent" />
          <h4 className="font-semibold text-main-text">Certifications</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {applicant.certifications.map((cert, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                cert.matched
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {cert.matched ? (
                <Icon icon="lucide:check" className="w-3 h-3 mr-1" />
              ) : (
                <Icon icon="lucide:x" className="w-3 h-3 mr-1" />
              )}
              {cert.name}
            </span>
          ))}
        </div>
      </div>

      {/* Assessment Performance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:target" className="w-5 h-5 text-main-accent" />
            <h4 className="font-semibold text-main-text">
              Assessment Performance
            </h4>
          </div>
          {applicant.assessment && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {applicant.assessment.overall}% Overall
            </span>
          )}
        </div>
        {applicant.assessment ? (
          <div className="space-y-3">
            {applicant.assessment.technicalAptitude !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-main-light-text">
                    Technical Aptitude
                  </span>
                  <span className="text-main-text font-medium">
                    {applicant.assessment.technicalAptitude}%
                  </span>
                </div>
                <div className="h-2 bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-main-accent rounded-full transition-all"
                    style={{
                      width: `${applicant.assessment.technicalAptitude}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {applicant.assessment.problemSolving !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-main-light-text">Problem Solving</span>
                  <span className="text-main-text font-medium">
                    {applicant.assessment.problemSolving}%
                  </span>
                </div>
                <div className="h-2 bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-main-accent rounded-full transition-all"
                    style={{ width: `${applicant.assessment.problemSolving}%` }}
                  />
                </div>
              </div>
            )}
            {applicant.assessment.safetyAwareness !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-main-light-text">Safety Awareness</span>
                  <span className="text-main-text font-medium">
                    {applicant.assessment.safetyAwareness}%
                  </span>
                </div>
                <div className="h-2 bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-main-accent rounded-full transition-all"
                    style={{
                      width: `${applicant.assessment.safetyAwareness}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {applicant.assessment.adaptability !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-main-light-text">Adaptability</span>
                  <span className="text-main-text font-medium">
                    {applicant.assessment.adaptability}%
                  </span>
                </div>
                <div className="h-2 bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-main-accent rounded-full transition-all"
                    style={{ width: `${applicant.assessment.adaptability}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-main-light-text">
            This candidate hasn't completed the assessment yet.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-subtle">
        <Button variant="accent" size="sm" className=" ">
          View Profile
        </Button>
        <Button variant="outline" size="sm">
          Message
        </Button>
        {applicant.status !== "rejected" &&
          applicant.status !== "withdrawn" &&
          (applicant.status === "reviewed" ||
            applicant.status === "accepted") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              Schedule Interview
            </Button>
          )}
      </div>

      <ScheduleInterviewModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        applicationId={applicant.id}
        candidateName={applicant.name}
        jobTitle={applicant.jobTitle}
        onSuccess={handleInterviewScheduled}
      />
    </div>
  );
}
