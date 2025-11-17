"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";

interface ToastProps {
  message: string;
  description?: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  description,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20",
      icon: "lucide:check-circle",
    },
    error: {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      borderColor: "border-red-500/20",
      icon: "lucide:alert-triangle",
    },
    info: {
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      icon: "lucide:info",
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-subtle/60 bg-surface/95 backdrop-blur-sm shadow-xl">
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-main-accent/5 opacity-50`}></div>

        <div className="relative flex items-center gap-4 h-fit p-5">
          {/* Icon */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${config.iconBg} ${config.iconColor} flex-shrink-0`}
          >
            <Icon icon={config.icon} className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="text-main-text text-sm leading-tight font-medium">{message}</p>
            {description && (
              <p className="text-main-light-text text-sm mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-light-bg transition-colors duration-200 group flex-shrink-0"
            aria-label="Close notification"
          >
            <Icon
              icon="lucide:x"
              className="w-4 h-4 text-main-light-text group-hover:text-main-text transition-colors duration-200"
            />
          </button>
        </div>

        {/* Subtle accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-main-accent/0 via-main-accent/50 to-main-accent/0"></div>
      </div>
    </div>
  );
}
