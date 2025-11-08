"use client";

import { NotificationCard } from "./NotificationCard";
import { Notification } from "../data";

interface NotificationsListProps {
  notifications: Notification[];
  onView: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationsList({
  notifications,
  onView,
  onMarkAsRead,
  onDelete,
}: NotificationsListProps) {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-12 text-main-light-text">
          <p>No notifications found matching your criteria.</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onView={onView}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

