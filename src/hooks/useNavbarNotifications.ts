"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/contexts/WebSocketContext";

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId: string;
}

const fetchNotifications = async (): Promise<{
  notifications: NotificationItem[];
  total: number;
}> => {
  const response = await fetch("/api/notifications", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  return response.json();
};

export const useNavbarNotifications = () => {
  const queryClient = useQueryClient();
  const { webSocketService, isConnected, userId } = useWebSocket();
  const [localNotifications, setLocalNotifications] = useState<
    NotificationItem[]
  >([]);

  // Query for fetching notifications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["navbar-notifications"],
    queryFn: fetchNotifications,
    enabled: !!userId, // Only fetch when userId is available
    refetchInterval: 30000, // Refetch every 30 seconds as backup
    refetchOnWindowFocus: true,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Initialize local notifications from query data
  useEffect(() => {
    if (data?.notifications) {
      console.log(
        "📋 Navbar: Setting notifications from query data:",
        data.notifications.length
      );
      setLocalNotifications(data.notifications);
    }
  }, [data]);

  // WebSocket real-time updates
  useEffect(() => {
    if (!webSocketService || !isConnected) return;

    const handleMessage = (message: any) => {
      console.log("📨 Navbar received WebSocket message:", message);

      if (message.type === "notification") {
        const newNotification: NotificationItem = {
          id: message.data.id,
          message: message.data.message,
          read: false,
          createdAt: message.data.createdAt,
          orderId: message.data.orderId,
        };

        // Add to local state immediately for instant UI update
        setLocalNotifications((prev) => [newNotification, ...prev]);

        // Invalidate query to refetch from server
        queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });

        console.log(
          "🔔 New notification added to navbar:",
          newNotification.message
        );
      }
    };

    // Listen for WebSocket messages
    webSocketService.on("message", handleMessage);

    return () => {
      webSocketService.off("message");
    };
  }, [webSocketService, isConnected, queryClient]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Optimistically update local state
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );

      // Make API call to mark as read
      const response = await fetch("/api/notifications", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          action: "mark_read",
        }),
      });

      if (!response.ok) {
        console.error("Failed to mark notification as read");
        // Revert optimistic update
        setLocalNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistically update local state
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Make API call to mark all as read
      const response = await fetch("/api/notifications", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mark_all_read",
        }),
      });

      if (!response.ok) {
        console.error("Failed to mark all notifications as read");
        // Revert optimistic update
        refetch();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      refetch();
    }
  };

  const refreshNotifications = () => {
    refetch();
  };

  const notifications = localNotifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  return {
    notifications,
    unreadCount,
    hasUnread,
    isLoading,
    error,
    isConnected,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
};
