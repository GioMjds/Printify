'use client';

import notificationService, { NotificationData } from "@/services/NotificationService";
import { WebSocketService } from "@/services/WebSockets";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UseNotificationsProps {
  webSocketService?: WebSocketService;
  showToasts?: boolean;
}

export const useNotifications = ({
  webSocketService,
  showToasts = true,
}: UseNotificationsProps = {}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (webSocketService) {
      notificationService.setWebSocketService(webSocketService);
    }

    // Subscribe to notifications
    const subscriptionId = notificationService.onNotification(
      (notification) => {
        console.log("Received notification:", notification);

        // Add to local state
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast if enabled
        if (showToasts) {
          const isRejection = notification.status === "rejected";
          const toastType = isRejection ? "error" : "info";

          toast[toastType](notification.message, {
            position: "top-right",
            autoClose: isRejection ? 8000 : 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Invalidate and refetch orders query to get real-time updates
        queryClient.invalidateQueries({ queryKey: ["printOrders"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    );

    return () => {
      notificationService.offNotification(subscriptionId);
    };
  }, [webSocketService, showToasts, queryClient]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  };
};
