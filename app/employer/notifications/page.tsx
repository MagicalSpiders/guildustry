"use client";

import { useState, useMemo } from "react";
import { NotificationsHeader } from "@/src/app/employer/notifications/components/NotificationsHeader";
import { NotificationsStats } from "@/src/app/employer/notifications/components/NotificationsStats";
import { NotificationsTabs } from "@/src/app/employer/notifications/components/NotificationsTabs";
import { NotificationsList } from "@/src/app/employer/notifications/components/NotificationsList";
import { ViewApplicationModal } from "@/src/app/employer/notifications/components/ViewApplicationModal";
import { ViewDetailsModal } from "@/src/app/employer/notifications/components/ViewDetailsModal";
import { Toast } from "@/src/app/employer/notifications/components/Toast";
import { mockNotifications, Notification } from "@/src/app/employer/notifications/data";

export default function EmployerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    description?: string;
    type?: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    isVisible: false,
  });

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => n.status === "unread");
      case "applications":
        return notifications.filter((n) => n.type === "application");
      case "interviews":
        return notifications.filter((n) => n.type === "interview");
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => n.status === "unread").length,
      applications: notifications.filter((n) => n.type === "application").length,
      interviews: notifications.filter((n) => n.type === "interview").length,
    };
  }, [notifications]);

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    if (notification.type === "application") {
      setIsApplicationModalOpen(true);
    } else {
      setIsDetailsModalOpen(true);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" as const } : n))
    );
    setToast({
      message: "Notification marked as read",
      description: "The notification has been marked as read.",
      type: "success",
      isVisible: true,
    });
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToast({
      message: "Notification deleted",
      description: "The notification has been removed.",
      type: "success",
      isVisible: true,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <div className="min-h-screen bg-main-bg text-main-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <NotificationsHeader />
          <NotificationsStats
            total={stats.total}
            unread={stats.unread}
            applications={stats.applications}
            interviews={stats.interviews}
          />

          <NotificationsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              all: stats.total,
              unread: stats.unread,
              applications: stats.applications,
              interviews: stats.interviews,
            }}
          />

          <NotificationsList
            notifications={filteredNotifications}
            onView={handleView}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        </div>

        {/* Modals */}
        <ViewApplicationModal
          open={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedNotification(null);
          }}
          notification={selectedNotification}
        />

        <ViewDetailsModal
          open={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedNotification(null);
          }}
          notification={selectedNotification}
        />
      </div>

      {/* Toast - rendered outside container for proper positioning */}
      <Toast
        message={toast.message}
        description={toast.description}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </>
  );
}

