"use client";

import { useWebSocket } from "@/contexts/WebSocketContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  const { webSocketService, isConnected } = useWebSocket();
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([]);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["navbar-notifications"],
    queryFn: fetchNotifications,
    enabled: true,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });

  useEffect(() => {
    if (data?.notifications) setLocalNotifications(data.notifications);
  }, [data]);

  useEffect(() => {
    if (!webSocketService || !isConnected) return;

    const handleMessage = (message: any) => {
      if (message.type === "notification") {
        const newNotification: NotificationItem = {
          id: message.data.id,
          message: message.data.message,
          read: false,
          createdAt: message.data.createdAt,
          orderId: message.data.orderId,
        };
        setLocalNotifications((prev) => [newNotification, ...prev]);
        queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      }
    };

    webSocketService.on("message", handleMessage);

    return () => {
      webSocketService.off("message");
    };
  }, [webSocketService, isConnected, queryClient]);

  const markAsRead = async (notificationId: string) => {
    try {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );

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
        setLocalNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
        );
        throw new Error("Failed to mark notification as read");
      } else {
        queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const previousNotifications = localNotifications;
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

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
        setLocalNotifications(previousNotifications);
        throw new Error("Failed to mark all notifications as read");
      } else {
        queryClient.invalidateQueries({ queryKey: ["navbar-notifications"] });
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
