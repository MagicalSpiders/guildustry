"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { NoticeModal } from "@/src/components/NoticeModal";
import { insertInterview } from "@/src/lib/interviewsFunctions";
import { updateApplication } from "@/src/lib/applicationsFunctions";
import type { InterviewInsert } from "@/src/lib/database.types";

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  onSuccess?: () => void;
}

export function ScheduleInterviewModal({
  open,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
  onSuccess,
}: ScheduleInterviewModalProps) {
  const [formData, setFormData] = useState({
    interview_date: "",
    interview_time: "",
    type: "phone" as "phone" | "in-person" | "video",
    location: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noticeModal, setNoticeModal] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant: "success" | "error" | "info";
  }>({
    open: false,
    title: "",
    variant: "info",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time
      const interviewDateTime = new Date(
        `${formData.interview_date}T${formData.interview_time}`
      ).toISOString();

      // Create interview
      const interviewData: InterviewInsert = {
        application_id: applicationId,
        interview_date: interviewDateTime,
        type: formData.type,
        status: "scheduled",
        location: formData.location || null,
        notes: formData.notes || null,
        interviewers: null, // Can be added later
      };

      await insertInterview(interviewData);

      // Update application status to reviewed (since interview has been scheduled)
      await updateApplication(applicationId, {
        status: "reviewed",
      });

      // Show success modal
      setNoticeModal({
        open: true,
        title: "Interview Scheduled Successfully!",
        description: `Interview with ${candidateName} for ${jobTitle} has been scheduled.`,
        variant: "success",
      });

      // Reset form and close after a delay
      setTimeout(() => {
        setFormData({
          interview_date: "",
          interview_time: "",
          type: "phone",
          location: "",
          notes: "",
        });
        setNoticeModal({ open: false, title: "", variant: "info" });
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to schedule interview";
      setNoticeModal({
        open: true,
        title: "Failed to Schedule Interview",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-2xl border border-subtle shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-subtle">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-main-text">
              Schedule Interview
            </h2>
            <button
              onClick={onClose}
              className="text-main-light-text hover:text-main-text transition-colors"
            >
              <Icon icon="lucide:x" className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-main-light-text">
            Schedule an interview with {candidateName} for {jobTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-main-light-text">
                Interview Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.interview_date}
                onChange={(e) =>
                  setFormData({ ...formData, interview_date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-main-light-text">
                Interview Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.interview_time}
                onChange={(e) =>
                  setFormData({ ...formData, interview_time: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-main-light-text">
              Interview Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "phone" | "in-person" | "video",
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
            >
              <option value="phone">Phone Interview</option>
              <option value="video">Video Interview</option>
              <option value="in-person">In-Person Interview</option>
            </select>
          </div>

          {formData.type === "in-person" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-main-light-text">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required={formData.type === "in-person"}
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter interview location"
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
              />
            </div>
          )}

          {formData.type === "video" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-main-light-text">
                Video Link (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter video call link"
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-main-light-text">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any additional notes or instructions for the candidate"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-subtle">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </div>

      {/* Notice Modal */}
      <NoticeModal
        open={noticeModal.open}
        title={noticeModal.title}
        description={noticeModal.description}
        variant={noticeModal.variant}
        onClose={() => {
          setNoticeModal({ open: false, title: "", variant: "info" });
          if (noticeModal.variant === "error") {
            // Don't close the modal on error, just close the notice
            return;
          }
        }}
      />
    </div>
  );
}
