import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

type NoticeVariant = "success" | "error" | "info";

interface NoticeModalProps {
  open: boolean;
  title: string;
  description?: string;
  variant?: NoticeVariant;
  primaryAction?: { label: string; onClick: () => void; disabled?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
  onClose: () => void;
}

const variantIcon: Record<NoticeVariant, string> = {
  success: "lucide:check-circle-2",
  error: "lucide:alert-triangle",
  info: "lucide:info",
};

const variantStyles: Record<
  NoticeVariant,
  { iconBg: string; iconColor: string; borderColor: string }
> = {
  success: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    borderColor: "border-green-500/20",
  },
  error: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    borderColor: "border-red-500/20",
  },
  info: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20",
  },
};

export function NoticeModal({
  open,
  title,
  description,
  variant = "info",
  primaryAction,
  secondaryAction,
  onClose,
}: NoticeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle mount/unmount with fade transitions
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to trigger fade-in after render
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for fade-out animation before unmounting
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-50 w-full max-w-md rounded-2xl border ${
          styles.borderColor
        } bg-surface shadow-2xl transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${styles.iconBg} ${styles.iconColor}`}
            >
              <Icon icon={variantIcon[variant]} className="w-8 h-8" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-title font-bold text-main-text text-center mb-4">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-center text-base text-main-light-text leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-8 pb-6 flex items-center justify-center gap-3">
          {secondaryAction ? (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="flex-1 px-5 cursor-pointer py-2.5 rounded-lg border border-subtle bg-light-bg text-main-text hover:border-main-accent/50 hover:bg-surface transition-all text-sm font-medium"
            >
              {secondaryAction.label}
            </button>
          ) : (
            !primaryAction && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 cursor-pointer py-2.5 rounded-lg border border-subtle bg-light-bg text-main-text hover:border-main-accent/50 hover:bg-surface transition-all text-sm font-medium"
              >
                Close
              </button>
            )
          )}

          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="flex-1 px-5 py-2.5 rounded-lg bg-main-accent text-main-bg font-medium hover:opacity-90 active:scale-95 transition-all text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
