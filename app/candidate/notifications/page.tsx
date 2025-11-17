"use client";

import { useState, useMemo, useEffect } from "react";
import { NotificationsHeader } from "@/app/candidate/notifications/components/NotificationsHeader";
import { NotificationsStats } from "@/app/candidate/notifications/components/NotificationsStats";
import { NotificationsTabs } from "@/app/candidate/notifications/components/NotificationsTabs";
import { NotificationsList } from "@/app/candidate/notifications/components/NotificationsList";
import { ViewApplicationModal } from "@/app/candidate/notifications/components/ViewApplicationModal";
import { ViewDetailsModal } from "@/app/candidate/notifications/components/ViewDetailsModal";
import { Toast } from "@/app/candidate/notifications/components/Toast";
import { Notification } from "@/app/candidate/notifications/data";
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

  // Determine notification type and properties based on type
  let type: Notification["type"] = "system";
  let label = "Update";
  let labelColor: Notification["labelColor"] = "grey";
  let icon = "lucide:bell";
  let actionButtonText = "View Details";
  let actionButtonLink = "";

  switch (dbNotif.type) {
    case "application_status":
      type = "application";
      label = "Application Update";
      labelColor = "blue";
      icon = "lucide:file-check";
      actionButtonText = "View Application";
      actionButtonLink = metadata.applicationId
        ? `/candidate/applications?selected=${metadata.applicationId}`
        : "/candidate/applications";
      break;
    case "interview_scheduled":
      type = "interview";
      label = "Interview";
      labelColor = "green";
      icon = "lucide:calendar";
      actionButtonText = "View Details";
      actionButtonLink = metadata.interviewId
        ? `/candidate/interviews?selected=${metadata.interviewId}`
        : "/candidate/interviews";
      break;
    case "interview_reminder":
      type = "interview";
      label = "Interview Reminder";
      labelColor = "grey";
      icon = "lucide:clock";
      actionButtonText = "View Details";
      actionButtonLink = metadata.interviewId
        ? `/candidate/interviews?selected=${metadata.interviewId}`
        : "/candidate/interviews";
      break;
    case "job_match":
      type = "job";
      label = "Job Match";
      labelColor = "orange";
      icon = "lucide:briefcase";
      actionButtonText = "View Job";
      actionButtonLink = metadata.jobId
        ? `/candidate/jobs?selected=${metadata.jobId}`
        : "/candidate/jobs";
      break;
    case "profile_view":
      type = "system";
      label = "Profile";
      labelColor = "grey";
      icon = "lucide:eye";
      actionButtonText = "View Profile";
      actionButtonLink = "/candidate/profile";
      break;
    case "system_alert":
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
    primaryEntityName: metadata.companyName || metadata.jobTitle || "",
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
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return `${Math.floor(seconds / 2592000)} months ago`;
}

export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "unread">("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ show: false, message: "", type: "info" });
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

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    const cleanup = subscribeToNotifications((payload) => {
      console.log("New notification:", payload);
      // Reload notifications when new ones arrive
      loadNotifications();
    });

    return cleanup;
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all notifications for current user
      const allNotifications = await getAllNotifications();

      // Transform database notifications to UI format
      const transformedNotifications = allNotifications.map(
        transformNotification
      );

      setNotifications(transformedNotifications);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load notifications";
      setError(errorMessage);
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, status: "read" } : notif
        )
      );

      setToast({
        show: true,
        message: "Notification marked as read",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Failed to mark as read",
        type: "error",
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );

      setToast({
        show: true,
        message: "Notification deleted",
        type: "success",
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || "Failed to delete notification",
        type: "error",
      });
    }
  };

  const handleAction = (notification: Notification) => {
    setSelectedNotification(notification);

    // Handle different action types
    if (notification.type === "application") {
      setShowApplicationModal(true);
    } else {
      setShowDetailsModal(true);
    }
  };

  // Filter notifications based on selected tab
  const filteredNotifications = useMemo(() => {
    if (selectedTab === "unread") {
      return notifications.filter((notif) => notif.status === "unread");
    }
    return notifications;
  }, [notifications, selectedTab]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.status === "unread").length;
    const applications = notifications.filter(
      (n) => n.type === "application"
    ).length;
    const interviews = notifications.filter(
      (n) => n.type === "interview"
    ).length;

    return {
      total,
      unread,
      applications,
      interviews,
    };
  }, [notifications]);

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
                label: "OK",
                onClick: () => {
                  setNoticeModal({ open: false, title: "", variant: "info" });
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
            activeTab={selectedTab}
            onTabChange={(tab: string) =>
              setSelectedTab(tab as "all" | "unread")
            }
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
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadNotifications}
                className="px-4 py-2 bg-main-accent text-main-bg rounded-lg hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">
                {selectedTab === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>
            </div>
          ) : (
            <NotificationsList
              notifications={filteredNotifications}
              onView={handleAction}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewApplicationModal
        open={showApplicationModal}
        notification={selectedNotification}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedNotification(null);
        }}
      />

      <ViewDetailsModal
        open={showDetailsModal}
        notification={selectedNotification}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedNotification(null);
        }}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </>
  );
}
