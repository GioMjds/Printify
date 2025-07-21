// Utility functions for managing notifications

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
}

// Helper to create a new notification
export const createNotification = (
  message: string,
  orderId?: string,
  read: boolean = false
): Notification => ({
  id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  message,
  read,
  createdAt: new Date().toISOString(),
  orderId,
});

// Helper to format notification time
export const formatNotificationTime = (createdAt: string): string => {
  const now = new Date();
  const notificationTime = new Date(createdAt);
  const diffInMinutes = Math.floor(
    (now.getTime() - notificationTime.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return notificationTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      notificationTime.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
};

export const generateNotificationMessage = (filename: string, status: string, rejectionReason?: string): string => {
  switch (status) {
    case "printing":
      return `Your print order "${filename}" is now being printed.`;
    case "ready_to_pickup":
      return `Your print order "${filename}" is ready for pickup!`;
    case "completed":
      return `Your print order "${filename}" has been completed.`;
    case "cancelled":
      return `Your print order "${filename}" has been cancelled.`;
    case "rejected":
      const reason = rejectionReason ? ` Reason: ${rejectionReason}` : "";
      return `Your print order "${filename}" has been rejected.${reason}`;
    default:
      return `Your print order "${filename}" status has been updated to ${status}.`;
  }
}