'use client';

import { getSession } from '@/services/Auth';
import notificationService from '@/services/NotificationService';
import { WebSocketService } from '@/services/WebSockets';
import { Notification } from '@/types/Navbar';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface WebSocketContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    isConnected: boolean;
    userId: string | null;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    webSocketService: WebSocketService;
}

interface NotificationMessageData {
    id: string;
    message: string;
    createdAt: string;
    orderId?: string;
}

interface WebSocketMessage {
    type: string;
    data?: NotificationMessageData;
}

// Type guards for runtime safety
function isWebSocketMessage(data: unknown): data is WebSocketMessage {
    return typeof data === 'object' && data !== null && 'type' in data;
}
function isNotificationMessageData(data: unknown): data is NotificationMessageData {
    return typeof data === 'object' && data !== null && 'id' in data && 'message' in data && 'createdAt' in data;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [webSocketService] = useState(() => new WebSocketService(process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001'));
    const [userId, setUserId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

    // Get user session and ID
    useEffect(() => {
        const getUserSession = async () => {
            try {
                const session = await getSession();
                if (session?.userId) {
                    setUserId(session?.userId);
                    console.log('✅ Got user session:', session.user.userId);
                }
            } catch (error) {
                console.error('❌ Failed to get user session:', error);
                setConnectionStatus('error');
            }
        };
        getUserSession();
    }, []);

    // Fetch initial notifications from API
    useEffect(() => {
        const fetchInitialNotifications = async () => {
            if (!userId) return;

            try {
                console.log('📥 Fetching initial notifications...');
                const response = await fetch('/api/notifications', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const notifications = data.notifications || [];
                    setNotifications(notifications);
                    console.log(`✅ Loaded ${notifications.length} notifications`);
                } else {
                    console.warn('⚠️  Failed to fetch notifications:', response.status, response.statusText);
                    if (response.status === 401) {
                        console.log('🔐 User not authenticated');
                    }
                }
            } catch (error) {
                console.error('❌ Failed to fetch notifications:', error);
            }
        };

        if (userId) {
            fetchInitialNotifications();
        }
    }, [userId]);

    const addNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        console.log('🔔 New notification added:', notification.message);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // WebSocket connection management
    useEffect(() => {
        if (!userId) {
            setConnectionStatus('disconnected');
            return;
        }

        console.log('🔌 Attempting to connect WebSocket for user:', userId);
        setConnectionStatus('connecting');

        // Connect to WebSocket with actual user ID
        webSocketService.connect(userId);

        // Set notification service
        notificationService.setWebSocketService(webSocketService);

        // Set up connection status listeners
        webSocketService.on('connect', (data) => {
            setIsConnected(true);
            setConnectionStatus('connected');
            console.log('✅ WebSocket connected successfully:', data);
        });

        webSocketService.on('disconnect', (data) => {
            setIsConnected(false);
            setConnectionStatus('disconnected');
            console.log('🔌 WebSocket disconnected:', data);
        });

        webSocketService.on('error', (error) => {
            setIsConnected(false);
            setConnectionStatus('error');
            console.error('❌ WebSocket error:', error);
        });

        // Listen for new notifications
        webSocketService.on('message', (data) => {
            if (isWebSocketMessage(data)) {
                console.log('🔔 Received message via WebSocket:', data);

                if (data.type === 'notification' && data.data) {
                    addNotification({
                        id: data.data.id,
                        message: data.data.message,
                        read: false,
                        createdAt: data.data.createdAt,
                        orderId: data.data.orderId
                    });
                }
            }
        });

        // Listen for direct notifications (legacy support)
        webSocketService.on('notification', (data) => {
            if (isNotificationMessageData(data)) {
                console.log('🔔 Received notification via WebSocket:', data);
                addNotification({
                    id: data.id,
                    message: data.message,
                    read: false,
                    createdAt: data.createdAt,
                    orderId: data.orderId
                });
            }
        });

        // Listen for heartbeat acknowledgments
        webSocketService.on('heartbeat_ack', () => {
            // Keep connection alive
        });

        webSocketService.on('pong', () => {
            // Connection is alive
        });

        // Cleanup on unmount or userId change
        return () => {
            console.log('🧹 Cleaning up WebSocket connection');
            webSocketService.disconnect();
            setIsConnected(false);
            setConnectionStatus('disconnected');
        };
    }, [webSocketService, userId]);

    const value = useMemo(() => ({
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        isConnected,
        userId,
        connectionStatus,
        webSocketService
    }), [notifications, isConnected, userId, connectionStatus, webSocketService]);

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}