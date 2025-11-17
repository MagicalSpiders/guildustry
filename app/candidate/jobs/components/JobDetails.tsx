"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { CandidateJob } from "../data/mockJobs";
import { ApplicationModal } from "./ApplicationModal";
import { insertApplication } from "@/src/lib/applicationsFunctions";
import type { ApplicationInsert } from "@/src/lib/database.types";
import { NoticeModal } from "@/src/components/NoticeModal";

interface JobDetailsProps {
  job: CandidateJob | null;
  onApply?: (jobId: string) => void;
}

export function JobDetails({ job, onApply }: JobDetailsProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successJobTitle, setSuccessJobTitle] = useState("");

  const handleApplyClick = () => {
    if (job && !job.hasApplied) {
      setShowApplicationModal(true);
    }
  };

  const handleApplicationSuccess = (jobTitle: string) => {
    setSuccessJobTitle(jobTitle);
    setShowSuccessModal(true);
  };

  const handleSubmitApplication = async (
    coverLetter: string,
    resumeUrl?: string
  ) => {
    if (!job) throw new Error("No job selected");

    // insertApplication will automatically set applicant_id from authenticated user
    const applicationData: Omit<ApplicationInsert, "applicant_id"> = {
      job_id: job.id,
      status: "pending",
      cover_letter: coverLetter,
      resume_url: resumeUrl || null,
      submitted_at: new Date().toISOString(),
    };

    await insertApplication(applicationData as ApplicationInsert);

    // Notify parent component to refresh
    onApply?.(job.id);
  };

  if (!job) {
    return (
      <div className="rounded-lg bg-surface border border-subtle p-8 text-center">
        <Icon
          icon="lucide:briefcase"
          className="w-16 h-16 text-main-light-text mx-auto mb-4"
        />
        <p className="text-main-light-text">Select a job to view details</p>
      </div>
    );
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 80) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (score >= 70)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
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
            <div className="flex items-center gap-2 text-main-light-text mb-3">
              <Icon icon="lucide:building-2" className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getMatchScoreColor(
              job.matchScore
            )}`}
          >
            {job.matchScore}% Match
          </span>
        </div>

        <div className="space-y-2 mb-4">
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
            <span>Posted {job.posted}</span>
          </div>
          <div className="flex items-center gap-2 text-main-light-text">
            <Icon icon="lucide:calendar" className="w-4 h-4" />
            <span>
              Start Date: {new Date(job.startDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-4">
          {job.hasApplied ? (
            <Button variant="outline" size="md" className="w-full" disabled>
              <Icon icon="lucide:check" className="w-5 h-5 mr-2" />
              Already Applied
            </Button>
          ) : (
            <Button
              variant="accent"
              size="md"
              className="w-full"
              onClick={handleApplyClick}
            >
              <Icon icon="lucide:send" className="w-5 h-5 mr-2" />
              Apply Now
            </Button>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:file-text" className="w-5 h-5 text-main-accent" />
          <h3 className="font-semibold text-main-text">Job Description</h3>
        </div>
        <p className="text-main-light-text leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Job Requirements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:target" className="w-5 h-5 text-main-accent" />
          <h3 className="font-semibold text-main-text">Requirements</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-main-light-text mb-1">
              Trade Specialty:
            </p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {job.tradeSpecialty}
            </span>
          </div>
          <div>
            <p className="text-sm text-main-light-text mb-1">
              Employment Type:
            </p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {job.employmentType}
            </span>
          </div>
          <div>
            <p className="text-sm text-main-light-text mb-1">Shift Pattern:</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {job.shiftPattern}
            </span>
          </div>
          <div>
            <p className="text-sm text-main-light-text mb-1">
              Minimum Education:
            </p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {job.minimumEducation}
            </span>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-main-light-text mb-1">Transportation:</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {job.transportationRequired}
            </span>
          </div>
        </div>
      </div>

      {/* Required Certifications */}
      {job.requiredCertifications.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="lucide:award" className="w-5 h-5 text-main-accent" />
            <h3 className="font-semibold text-main-text">
              Required Certifications
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.requiredCertifications.map((cert, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface border border-subtle text-main-text"
              >
                <Icon icon="lucide:check-circle" className="w-3 h-3 mr-1" />
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Priority Skills */}
      {job.prioritySkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="lucide:zap" className="w-5 h-5 text-main-accent" />
            <h3 className="font-semibold text-main-text">Priority Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.prioritySkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-main-accent/10 text-main-accent border border-main-accent/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        open={showApplicationModal}
        jobTitle={job.title}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleSubmitApplication}
        onSuccess={handleApplicationSuccess}
      />

      {/* Success Notice Modal */}
      <NoticeModal
        open={showSuccessModal}
        title="Application Submitted!"
        description={`Your application for ${successJobTitle} has been submitted successfully. The employer will review your application and get back to you soon.`}
        variant="success"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
