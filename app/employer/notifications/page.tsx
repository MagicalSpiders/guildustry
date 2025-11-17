"use client";

import { useState, useMemo, useEffect } from "react";
import { NotificationsHeader } from "@/app/employer/notifications/components/NotificationsHeader";
import { NotificationsStats } from "@/app/employer/notifications/components/NotificationsStats";
import { NotificationsTabs } from "@/app/employer/notifications/components/NotificationsTabs";
import { NotificationsList } from "@/app/employer/notifications/components/NotificationsList";
import { ViewApplicationModal } from "@/app/employer/notifications/components/ViewApplicationModal";
import { ViewDetailsModal } from "@/app/employer/notifications/components/ViewDetailsModal";
import { Toast } from "@/app/employer/notifications/components/Toast";
import { Notification } from "@/app/employer/notifications/data";
import {
  getAllNotifications,
  markNotificationRead,
  deleteNotification,
  subscribeToNotifications,
  getNotificationCounts,
} from "@/src/lib/notificationsFunctions";
import type { Notification as DbNotification } from "@/src/lib/database.types";
import { NoticeModal } from "@/src/components/NoticeModal";

// Helper function to transform database notification to UI notification
function transformNotification(dbNotif: DbNotification): Notification {
  const timeAgo = getTimeAgo(new Date(dbNotif.created_at));
  
  // Extract metadata
  const metadata = (dbNotif.metadata as any) || {};
  
  // Determine notification type and properties based on database type
  let type: Notification["type"] = "system";
  let label = "Update";
  let labelColor: Notification["labelColor"] = "grey";
  let icon = "lucide:bell";
  let actionButtonText = "View Details";
  let actionButtonLink = "";
  
  switch (dbNotif.type) {
    case "application_status":
      type = "application";
      label = "New Application";
      labelColor = "blue";
      icon = "lucide:user-plus";
      actionButtonText = "View Application";
      actionButtonLink = metadata.applicationId
        ? `/employer/applicants?selected=${metadata.applicationId}`
        : "/employer/applicants";
      break;
    case "interview_reminder":
      type = "interview";
      label = "Interview Reminder";
      labelColor = "green";
      icon = "lucide:calendar";
      actionButtonText = "View Details";
      actionButtonLink = metadata.interviewId
        ? `/employer/interviews?selected=${metadata.interviewId}`
        : "/employer/interviews";
      break;
    case "job_update":
      type = "job";
      label = "Job Update";
      labelColor = "orange";
      icon = "lucide:briefcase";
      actionButtonText = "View Job";
      actionButtonLink = metadata.jobId
        ? `/employer/jobs?selected=${metadata.jobId}`
        : "/employer/jobs";
      break;
    case "company_news":
      type = "news";
      label = "Company News";
      labelColor = "blue";
      icon = "lucide:newspaper";
      actionButtonText = "Read More";
      actionButtonLink = metadata.link || "#";
      break;
    case "system_alert":
    case null:
    default:
      type = "system";
      label = "System";
      labelColor = "grey";
      icon = "lucide:alert-circle";
      actionButtonText = "Dismiss";
      break;
  }

  return {
    id: dbNotif.id,
    type,
    status: dbNotif.read ? "read" : "unread",
    timestamp: timeAgo,
    title: dbNotif.title,
    label,
    labelColor,
    icon,
    primaryEntityName: metadata.candidateName || metadata.jobTitle || "",
    description: dbNotif.message,
    actionButtonText,
    actionButtonLink,
    metadata,
  };
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export default function EmployerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
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

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        setNoticeModal({
          open: true,
          title: "Loading Notifications...",
          description: "Please wait while we fetch your notifications.",
          variant: "info",
        });

        const dbNotifications = await getAllNotifications();
        const transformedNotifications = dbNotifications.map(transformNotification);
        setNotifications(transformedNotifications);

        setNoticeModal({ open: false, title: "", variant: "info" });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to load notifications. Please try again later.";
        setError(errorMessage);
        setNoticeModal({
          open: true,
          title: "Error Loading Notifications",
          description: errorMessage,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    const unsubscribe = subscribeToNotifications((newNotification) => {
      const transformed = transformNotification(newNotification);
      setNotifications((prev) => [transformed, ...prev]);
      
      // Show toast for new notification
      setToast({
        message: "New notification",
        description: newNotification.title,
        type: "info",
        isVisible: true,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
      applications: notifications.filter((n) => n.type === "application")
        .length,
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

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" as const } : n))
      );
      setToast({
        message: "Notification marked as read",
        description: "The notification has been marked as read.",
        type: "success",
        isVisible: true,
      });
    } catch (error: any) {
      setToast({
        message: "Failed to mark as read",
        description: error.message || "An error occurred.",
        type: "error",
        isVisible: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setToast({
        message: "Notification deleted",
        description: "The notification has been removed.",
        type: "success",
        isVisible: true,
      });
    } catch (error: any) {
      setToast({
        message: "Failed to delete notification",
        description: error.message || "An error occurred.",
        type: "error",
        isVisible: true,
      });
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <NoticeModal
        open={noticeModal.open}
        title={noticeModal.title}
        description={noticeModal.description}
        variant={noticeModal.variant}
        onClose={() =>
          setNoticeModal({ open: false, title: "", variant: "info" })
        }
        primaryAction={
          noticeModal.variant === "error"
            ? {
                label: "Retry",
                onClick: () => {
                  setNoticeModal({ open: false, title: "", variant: "info" });
                  window.location.reload();
                },
              }
            : undefined
        }
      />

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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">
                {error
                  ? "Failed to load notifications. Please try again."
                  : "No notifications found."}
              </p>
            </div>
          ) : (
            <NotificationsList
              notifications={filteredNotifications}
              onView={handleView}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          )}
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
