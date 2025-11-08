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
      bg: "bg-green-500",
      icon: "lucide:check-circle",
    },
    error: {
      bg: "bg-red-500",
      icon: "lucide:x-circle",
    },
    info: {
      bg: "bg-blue-500",
      icon: "lucide:info",
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-[slideIn_0.3s_ease-out] pointer-events-auto">
      <div
        className={`${config.bg} text-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-md border border-white/20`}
      >
        <div className="flex items-start gap-3">
          <Icon icon={config.icon} className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
            {description && (
              <p className="text-xs text-white/90 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

