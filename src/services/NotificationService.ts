import { WebSocketService } from "./WebSockets";

export interface NotificationData {
  id: string;
  message: string;
  orderId: string;
  orderFilename: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  read: boolean;
}

type WebSocketMessage =
  | { type: "notification"; data: NotificationData }
  | { type: string; [key: string]: unknown };

export class NotificationService {
  private static instance: NotificationService;
  private webSocketService: WebSocketService | null = null;
  private callbacks: Map<string, (notification: NotificationData) => void> =
    new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setWebSocketService(wsService: WebSocketService) {
    this.webSocketService = wsService;

    // Listen for notification messages
    this.webSocketService.on("message", (data: WebSocketMessage) => {
      const isNotification = data.type === "notification" && this.isNotificationData(data.data);
      if (isNotification) {
        this.handleNotification((data as { data: NotificationData }).data);
      }
    });
  }

  private isNotificationData(data: unknown): data is NotificationData {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof (data as NotificationData).id === "string" &&
      typeof (data as NotificationData).message === "string" &&
      typeof (data as NotificationData).orderId === "string" &&
      typeof (data as NotificationData).orderFilename === "string" &&
      typeof (data as NotificationData).status === "string" &&
      typeof (data as NotificationData).createdAt === "string" &&
      typeof (data as NotificationData).read === "boolean"
    );
  }

  private handleNotification(notificationData: NotificationData) {
    // Trigger all registered callbacks
    this.callbacks.forEach((callback) => {
      callback(notificationData);
    });
  }

  // Subscribe to notifications
  onNotification(callback: (notification: NotificationData) => void): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.callbacks.set(id, callback);
    return id;
  }

  // Unsubscribe from notifications
  offNotification(id: string) {
    this.callbacks.delete(id);
  }

  // Send notification to a specific user (admin functionality)
  sendNotificationToUser(userId: string, notification: NotificationData) {
    if (this.webSocketService && this.webSocketService.isConnected) {
      this.webSocketService.send({
        type: "send_notification",
        targetUserId: userId,
        notification: notification,
      });
    }
  }
}

export default NotificationService.getInstance();
