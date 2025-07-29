export interface WebSocketMessage {
    type: string;
    data?: unknown;
    channel?: string;
}

export interface NotificationMessage {
    id: string;
    userId: string;
    message: string;
    orderId?: string;
    createdAt: string;
}

export interface WebSocketEventMap {
    connect: { userId: string };
    disconnect: { reason?: string };
    notification: NotificationMessage;
    error: { message: string };
    channelJoin: { channel: string; success: boolean };
    channelLeave: { channel: string; success: boolean };
}