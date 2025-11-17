import { supabase } from "./supabase";
import type {
  Notification,
  NotificationInsert,
  NotificationUpdate,
} from "./database.types";

/**
 * Notification with related data
 */
export type NotificationWithRelations = Notification & {
  application?: {
    id: string;
    job_id: string;
  };
};

/**
 * Get all unread notifications for the current user
 * @returns Array of unread notifications
 */
export async function getUnreadNotifications(): Promise<Notification[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("read", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch unread notifications: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all notifications for the current user
 * @param limit - Optional limit on number of notifications to return
 * @returns Array of notifications
 */
export async function getAllNotifications(
  limit?: number
): Promise<Notification[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return data || [];
}

/**
 * Mark a specific notification as read
 * @param notifId - The notification ID to mark as read
 * @returns The updated notification
 */
export async function markNotificationRead(
  notifId: string
): Promise<Notification> {
  const { data, error } = await (supabase
    .from("notifications") as any)
    .update({ read: true })
    .eq("id", notifId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to mark notification as read: No data returned");
  }

  return data as Notification;
}

/**
 * Mark all notifications as read for the current user
 * @returns Number of notifications marked as read
 */
export async function markAllNotificationsRead(): Promise<number> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to mark notifications as read");
  }

  // First get count of unread notifications
  const { data: unreadData, error: countError } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: false })
    .eq("user_id", user.id)
    .eq("read", false);

  if (countError) {
    throw new Error(`Failed to count unread notifications: ${countError.message}`);
  }

  const count = unreadData?.length || 0;

  // Update all unread notifications
  const { error } = await (supabase
    .from("notifications") as any)
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }

  return count;
}

/**
 * Delete a notification
 * @param notifId - The notification ID to delete
 * @returns True if successful
 */
export async function deleteNotification(notifId: string): Promise<boolean> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to delete notification");
  }

  // Verify user owns this notification
  const { data: notification, error: fetchError } = await supabase
    .from("notifications")
    .select("user_id")
    .eq("id", notifId)
    .single();

  if (fetchError || !notification) {
    throw new Error("Notification not found");
  }

  const notificationData = notification as { user_id: string };
  if (notificationData.user_id !== user.id) {
    throw new Error("You don't have permission to delete this notification");
  }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notifId);

  if (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }

  return true;
}

/**
 * Create a new notification (typically used by system/admin)
 * @param notification - The notification data to insert
 * @returns The created notification
 */
export async function createNotification(
  notification: NotificationInsert
): Promise<Notification> {
  const dataToInsert: NotificationInsert = {
    ...notification,
    read: notification.read ?? false,
  };

  const { data, error } = await supabase
    .from("notifications")
    .insert(dataToInsert as any)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }

  if (!data) {
    throw new Error("Failed to create notification: No data returned");
  }

  return data as Notification;
}

/**
 * Create notification for application status change
 * @param applicantId - The candidate's user ID
 * @param applicationId - The application ID
 * @param jobTitle - The job title
 * @param newStatus - The new application status
 * @returns The created notification
 */
export async function createApplicationStatusNotification(
  applicantId: string,
  applicationId: string,
  jobTitle: string,
  newStatus: string
): Promise<Notification> {
  const statusMessages: Record<string, string> = {
    pending: `Your application for ${jobTitle} has been received`,
    underReview: `Your application for ${jobTitle} is under review`,
    shortlisted: `Great news! You've been shortlisted for ${jobTitle}`,
    interviewScheduled: `Interview scheduled for ${jobTitle}`,
    rejected: `Update on your application for ${jobTitle}`,
  };

  const message = statusMessages[newStatus] || `Your application status has been updated`;

  return createNotification({
    user_id: applicantId,
    type: "application_status",
    title: "Application Update",
    message,
    metadata: {
      applicationId,
      jobTitle,
      status: newStatus,
    },
  });
}

/**
 * Create notification for new application received (employer)
 * @param employerId - The employer's user ID
 * @param applicationId - The application ID
 * @param jobTitle - The job title
 * @param candidateName - The candidate's name
 * @returns The created notification
 */
export async function createNewApplicationNotification(
  employerId: string,
  applicationId: string,
  jobTitle: string,
  candidateName: string
): Promise<Notification> {
  return createNotification({
    user_id: employerId,
    type: "application_status",
    title: "New Application Received",
    message: `${candidateName} has applied for ${jobTitle}`,
    metadata: {
      applicationId,
      jobTitle,
      candidateName,
    },
  });
}

/**
 * Create notification for interview scheduled
 * @param candidateId - The candidate's user ID
 * @param interviewId - The interview ID
 * @param jobTitle - The job title
 * @param interviewDate - The interview date/time
 * @returns The created notification
 */
export async function createInterviewScheduledNotification(
  candidateId: string,
  interviewId: string,
  jobTitle: string,
  interviewDate: string
): Promise<Notification> {
  const date = new Date(interviewDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return createNotification({
    user_id: candidateId,
    type: "interview_reminder",
    title: "Interview Scheduled",
    message: `Your interview for ${jobTitle} is scheduled for ${formattedDate}`,
    metadata: {
      interviewId,
      jobTitle,
      interviewDate,
    },
  });
}

/**
 * Get notification count for the current user
 * @returns Object with total and unread counts
 */
export async function getNotificationCounts(): Promise<{
  total: number;
  unread: number;
}> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { total: 0, unread: 0 };
  }

  // Get total count
  const { data: allData, error: allError } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: false })
    .eq("user_id", user.id);

  if (allError) {
    throw new Error(`Failed to count notifications: ${allError.message}`);
  }

  // Get unread count
  const { data: unreadData, error: unreadError } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: false })
    .eq("user_id", user.id)
    .eq("read", false);

  if (unreadError) {
    throw new Error(`Failed to count unread notifications: ${unreadError.message}`);
  }

  return {
    total: allData?.length || 0,
    unread: unreadData?.length || 0,
  };
}

/**
 * Subscribe to real-time notifications for the current user
 * @param callback - Function to call when new notification is received
 * @returns Unsubscribe function
 */
export function subscribeToNotifications(
  callback: (notification: Notification) => void
): () => void {
  let subscription: any;

  const setupSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  };

  setupSubscription();

  // Return unsubscribe function
  return () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  };
}

