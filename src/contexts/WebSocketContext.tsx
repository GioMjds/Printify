'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { WebSocketService } from '@/services/WebSockets';
import { Notification } from '@/types/Navbar';

interface WebSocketContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [webSocketService] = useState(() => new WebSocketService(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'));

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            try {
                const response = await fetch('/api/notifications');
                const data = await response.json();
                setNotifications(data.notifications);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchInitialNotifications();
    }, []);

    const addNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        // API call to mark as read would go here
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        // API call to mark all as read would go here
    };

    // Connect to WebSocket when user is authenticated
    useEffect(() => {
        // You'll need to get the current user ID from your auth context
        const userId = 'current-user-id'; // Replace with actual user ID

        if (userId) {
            webSocketService.connect(userId);

            // Listen for notifications
            webSocketService.on('notification', (message) => {
                addNotification({
                    id: message.id,
                    message: message.message,
                    read: false,
                    createdAt: message.createdAt,
                    orderId: message.orderId
                });
            });

            return () => {
                webSocketService.disconnect();
            };
        }
    }, [webSocketService]);

    const value = useMemo(() => ({
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead
    }), [notifications]);

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
};