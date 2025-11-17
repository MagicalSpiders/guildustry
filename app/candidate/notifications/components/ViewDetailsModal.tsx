"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { Notification } from "../data";

interface ViewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export function ViewDetailsModal({
  open,
  onClose,
  notification,
}: ViewDetailsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200);
  };

  useEffect(() => {
    if (open) {
      setIsAnimating(false);
    }
  }, [open]);

  if (!open && !isAnimating) return null;
  if (!notification) return null;

  const getIcon = () => {
    if (notification.type === "interview") return "lucide:calendar";
    if (notification.type === "performance") return "lucide:trending-up";
    return "lucide:info";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
            open && !isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div
          className={`relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-subtle max-h-[90vh] overflow-hidden transition-all duration-200 ${
            open && !isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-main-accent/10 flex items-center justify-center">
                <Icon icon={getIcon()} className="w-5 h-5 text-main-accent" />
              </div>
              <div>
                <h2 className="text-xl font-title font-bold text-main-text">
                  {notification.title}
                </h2>
                <p className="text-sm text-main-light-text">
                  {notification.primaryEntityName || "Details"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
            >
              <Icon icon="lucide:x" className="w-5 h-5 text-main-light-text" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-main-text mb-2">
                  Notification Details
                </h3>
                <p className="text-main-light-text leading-relaxed mb-4">
                  {notification.description}
                </p>
                {notification.metadata && (
                  <div className="space-y-3">
                    {notification.metadata.interviewDate && (
                      <div className="flex items-center gap-2 text-main-light-text">
                        <Icon icon="lucide:calendar" className="w-4 h-4" />
                        <span>
                          Date:{" "}
                          <span className="text-main-text font-medium">
                            {notification.metadata.interviewDate}
                          </span>
                        </span>
                      </div>
                    )}
                    {notification.metadata.views !== undefined && (
                      <div className="flex items-center gap-2 text-main-light-text">
                        <Icon icon="lucide:eye" className="w-4 h-4" />
                        <span>
                          Views:{" "}
                          <span className="text-main-text font-medium">
                            {notification.metadata.views}
                          </span>
                        </span>
                      </div>
                    )}
                    {notification.metadata.jobTitle && (
                      <div className="flex items-center gap-2 text-main-light-text">
                        <Icon icon="lucide:briefcase" className="w-4 h-4" />
                        <span>
                          Job:{" "}
                          <span className="text-main-text font-medium">
                            {notification.metadata.jobTitle}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-main-text mb-2">
                  Timestamp
                </h3>
                <p className="text-main-light-text">{notification.timestamp}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-subtle bg-light-bg/50">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            {notification.actionButtonLink && (
              <Button
                variant="accent"
                onClick={() => {
                  window.location.href = notification.actionButtonLink!;
                }}
              >
                {notification.actionButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
