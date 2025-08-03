'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllPrintOrders } from '@/services/Admin';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useEffect } from 'react';
import { PrintOrder } from '@/types/Admin';

interface OrderCounts {
    pending: number;
    readyToPickup: number;
    total: number;
}

interface WebSocketMessage {
    type: string;
    [key: string]: unknown;
}

export const useOrderCounts = () => {
    const queryClient = useQueryClient();
    const { webSocketService, isConnected } = useWebSocket();

    const { data, isLoading, error } = useQuery({
        queryKey: ['orderCounts'],
        queryFn: fetchAllPrintOrders,
    });

    useEffect(() => {
        if (!webSocketService || !isConnected) return;

        webSocketService.send({
            type: 'subscribe_admin_updates',
        });

        const handleMessage = (data: WebSocketMessage) => {
            if (
                data.type === 'order_status_update' ||
                data.type === 'new_order' ||
                data.type === 'order_created' ||
                data.type === 'admin_updates_subscribed'
            ) {
                console.log('📊 Order update received, refreshing counts...', data);

                queryClient.invalidateQueries({ queryKey: ['orderCounts'] });
                queryClient.invalidateQueries({ queryKey: ['printOrders'] });
                queryClient.refetchQueries({ queryKey: ['orderCounts'] });
            }
        };

        webSocketService.on('message', handleMessage);

        return () => {
            webSocketService.off('message');
        };
    }, [webSocketService, isConnected, queryClient]);

    const counts: OrderCounts = {
        pending: 0,
        readyToPickup: 0,
        total: 0,
    };

    if (data?.printOrders) {
        data.printOrders.forEach((order: PrintOrder) => {
            if (order.status === 'pending') {
                counts.pending++;
            } else if (order.status === 'ready_to_pickup') {
                counts.readyToPickup++;
            }
        });
        counts.total = counts.pending + counts.readyToPickup;
    }

    return {
        counts,
        isLoading,
        error,
    };
};