'use client';

import { useWebSocket } from "@/contexts/WebSocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNotifications } from "./useNotifications";

export const useCustomerNotifications = () => {
  const { webSocketService, isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications(
    {
      webSocketService,
      showToasts: true,
    }
  );

  // Refresh orders when notifications are received
  useEffect(() => {
    if (isConnected) {
      console.log(
        "Customer WebSocket connected, ready to receive notifications"
      );

      // Listen for specific message types that should trigger data refreshes
      webSocketService?.on("message", (message) => {
        if (message.type === "notification") {
          // Refresh customer's orders
          queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      });
    }
  }, [isConnected, webSocketService, queryClient]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    isConnected,
  };
};
