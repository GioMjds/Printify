// Utility functions for managing notifications

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
}

// Generate sample notifications for testing
export const generateSampleNotifications = (): Notification[] => [
  {
    id: "1",
    message: "Your print order #PO001 is ready for pickup!",
    read: false,
    createdAt: new Date().toISOString(),
    orderId: "PO001",
  },
  {
    id: "2",
    message: "Your print order #PO002 is currently being processed.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    orderId: "PO002",
  },
  {
    id: "3",
    message: "Welcome to Printify! Your account has been verified.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "4",
    message: "Your print order #PO003 has been completed and picked up.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    orderId: "PO003",
  },
];

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
