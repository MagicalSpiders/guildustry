"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { NoticeModal } from "@/src/components/NoticeModal";

interface ApplicationModalProps {
  open: boolean;
  jobTitle: string;
  onClose: () => void;
  onSubmit: (coverLetter: string, resumeUrl?: string) => Promise<void>;
  onSuccess?: (jobTitle: string) => void;
}

export function ApplicationModal({
  open,
  jobTitle,
  onClose,
  onSubmit,
  onSuccess,
}: ApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      setNoticeModal({
        open: true,
        title: "Cover Letter Required",
        description: "Please provide a cover letter for your application.",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setNoticeModal({
        open: true,
        title: "Submitting Application...",
        description: "Please wait while we submit your application.",
        variant: "info",
      });

      await onSubmit(coverLetter, resumeUrl || undefined);

      // Reset form
      setCoverLetter("");
      setResumeUrl("");

      // Close modal immediately and show success notification
      onClose();

      // Call success callback after modal closes
      if (onSuccess) {
        onSuccess(jobTitle);
      }
    } catch (error: any) {
      setNoticeModal({
        open: true,
        title: "Application Failed",
        description:
          error.message || "Failed to submit application. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <NoticeModal
        open={noticeModal.open}
        title={noticeModal.title}
        description={noticeModal.description}
        variant={noticeModal.variant}
        onClose={() => {
          if (noticeModal.variant !== "info") {
            setNoticeModal({ open: false, title: "", variant: "info" });
          }
        }}
        primaryAction={
          noticeModal.variant === "error"
            ? {
                label: "OK",
                onClick: () => {
                  setNoticeModal({ open: false, title: "", variant: "info" });
                },
              }
            : undefined
        }
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          className="relative z-50 w-full max-w-2xl rounded-2xl border border-subtle bg-surface shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-subtle">
            <div>
              <h2 className="text-2xl font-title font-bold text-main-text">
                Apply for Position
              </h2>
              <p className="text-main-light-text mt-1">{jobTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
              disabled={loading}
            >
              <Icon icon="lucide:x" className="w-5 h-5 text-main-light-text" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-main-text mb-2">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text placeholder-main-light-text focus:outline-none focus:ring-2 focus:ring-main-accent focus:border-transparent resize-none"
                disabled={loading}
              />
              <p className="text-xs text-main-light-text mt-1">
                {coverLetter.length} characters
              </p>
            </div>

            {/* Resume URL (Optional) */}
            <div>
              <label className="block text-sm font-medium text-main-text mb-2">
                Resume URL (Optional)
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://example.com/resume.pdf"
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text placeholder-main-light-text focus:outline-none focus:ring-2 focus:ring-main-accent focus:border-transparent"
                disabled={loading}
              />
              <p className="text-xs text-main-light-text mt-1">
                If you have a resume hosted online, paste the URL here
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-subtle">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleSubmit}
              disabled={loading || !coverLetter.trim()}
            >
              {loading ? (
                <>
                  <Icon
                    icon="lucide:loader-2"
                    className="w-5 h-5 mr-2 animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon icon="lucide:send" className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
