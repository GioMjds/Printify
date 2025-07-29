import { API } from "./_axios";

// Types for notification API
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
  upload?: {
    id: string;
    filename: string;
    status: string;
    customerId: string;
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export interface CreateNotificationRequest {
  uploadId: string;
  message: string;
  notificationType?: string;
}

export interface CreateNotificationResponse {
  notification: Notification;
  message: string;
}

// Fetch notifications for the current user
export const fetchUserNotifications = async (
  limit: number = 50,
  offset: number = 0,
  unreadOnly: boolean = false
): Promise<NotificationResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    const response = await API.get(`/notifications?${params}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Create a new notification (typically for admin use)
export const createNotification = async (
  notificationData: CreateNotificationRequest
): Promise<CreateNotificationResponse> => {
  try {
    const response = await API.post("/notifications", notificationData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  try {
    await API.put(
      "/notifications",
      {
        action: "mark_read",
        notificationId,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark multiple notifications as read
export const markNotificationsAsRead = async (
  notificationIds: string[]
): Promise<void> => {
  try {
    await API.put(
      "/notifications",
      {
        action: "mark_as_read",
        notificationIds,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await API.put(
      "/notifications",
      {
        action: "mark_all_read",
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete a specific notification
export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await API.delete(`/notifications?notificationId=${notificationId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Delete all notifications for a specific upload
export const deleteUploadNotifications = async (
  uploadId: string
): Promise<void> => {
  try {
    await API.delete(`/notifications?uploadId=${uploadId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting upload notifications:", error);
    throw error;
  }
};

// Helper function to create status-based notification messages
export const createStatusNotificationMessage = (
  status: string,
  filename: string,
): string => {
  switch (status) {
    case "pending":
      return `Your print order for "${filename}" has been received and is being reviewed.`;
    case "printing":
      return `Your print order for "${filename}" is now being printed.`;
    case "ready_to_pickup":
      return `Your print order for "${filename}" is ready for pickup!`;
    case "completed":
      return `Your print order for "${filename}" has been completed.`;
    case "rejected":
      return `Your print order for "${filename}" has been rejected. Please check the details.`;
    case "cancelled":
      return `Your print order for "${filename}" has been cancelled.`;
    default:
      return `Your print order for "${filename}" status has been updated.`;
  }
};

// Batch notification creation for admin actions
export const createStatusUpdateNotification = async (
  uploadId: string,
  newStatus: string,
  filename: string,
  customMessage?: string
): Promise<CreateNotificationResponse> => {
  const message =
    customMessage ||
    createStatusNotificationMessage(newStatus, filename);

  return createNotification({
    uploadId,
    message,
    notificationType: "status_update",
  });
};

// Get unread count for UI badge
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await API.get("/notifications/count", {
      withCredentials: true,
    });
    return response.data.unreadCount || 0;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
};
