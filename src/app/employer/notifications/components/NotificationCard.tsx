"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { Notification } from "../data";

interface NotificationCardProps {
  notification: Notification;
  onView: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationCard({
  notification,
  onView,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const getLabelColor = () => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      grey: "bg-surface border border-subtle text-main-light-text",
      orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      green: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return colors[notification.labelColor];
  };

  return (
    <div className="rounded-lg bg-surface border border-subtle p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-main-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon icon={notification.icon} className="w-6 h-6 text-main-accent" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-main-text">{notification.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLabelColor()}`}>
                {notification.label}
              </span>
              {notification.status === "unread" && (
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              )}
            </div>
            <span className="text-sm text-main-light-text whitespace-nowrap ml-2">
              {notification.timestamp}
            </span>
          </div>

          <p className="text-main-light-text mb-4">
            <span className="font-medium text-main-text">{notification.primaryEntityName}</span>{" "}
            {notification.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="accent"
              size="sm"
              onClick={() => onView(notification)}
            >
              {notification.actionButtonText}
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </Button>
            {notification.status === "unread" && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="flex items-center gap-1.5 text-sm text-main-light-text hover:text-main-text transition-colors"
              >
                <Icon icon="lucide:check" className="w-4 h-4" />
                Mark as Read
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

