'use client';

import PrintOrderModal from "@/components/PrintOrderModal";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useNotifications } from "@/hooks/useNotifications";
import { fetchAllPrintOrders, updateUploadStatus } from "@/services/Admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { getPrintOrderStatus, getStatus } from "@/utils/formatters";
import { PrintOrder } from "@/types/Admin";

export default function Orders() {
    const [openModalId, setOpenModalId] = useState<string | number | false>(false);
    const queryClient = useQueryClient();

    const { webSocketService } = useWebSocket();

    useNotifications({
        webSocketService,
        showToasts: false
    });

    const { data } = useQuery({
        queryKey: ['printOrders'],
        queryFn: () => fetchAllPrintOrders(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ 
            uploadId, 
            newStatus, 
            rejectionReason 
        }: { 
            uploadId: string; 
            newStatus: string; 
            rejectionReason?: string 
        }) => updateUploadStatus({ uploadId, newStatus, rejectionReason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['printOrders'] });
            queryClient.refetchQueries({ queryKey: ['printOrders'] });
            toast.success("Print order marked as ready for pickup");
            setOpenModalId(false);
        },
        onError: (error: Error) => {
            console.error(`Failed to update order status: ${error}`);
            toast.error("Failed to update print order status. Please try again.");
        }
    });

    const orders: PrintOrder[] = data?.printOrders || [];
    const selectedOrder = orders.find((order) => order.id === openModalId);

    const handleCloseModal = () => {
        if (!updateStatusMutation.isPending) {
            setOpenModalId(false);
        }
    };

    const handleReject = async (orderId: string, reason: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                uploadId: orderId,
                newStatus: "rejected",
                rejectionReason: reason
            });

            toast.success("Print order rejected successfully");
            setOpenModalId(false);
        } catch (error) {
            console.error(`Failed to reject order: ${error}`);
            toast.error("Failed to reject print order. Please try again.");
        }
    };

    const handleReadyToPickup = async (orderId: string, amount: number) => {
        try {
            await updateStatusMutation.mutateAsync({
                uploadId: orderId,
                newStatus: "ready_to_pickup"
            });
            toast.success(`Print order marked as ready for pickup with amount ₱${amount}`);
            setOpenModalId(false);
        } catch (error) {
            console.error(`Failed to mark order as ready: ${error}`);
            toast.error("Failed to update print order status. Please try again.");
        }
    };

    const handleCompleteOrder = async (orderId: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                uploadId: orderId,
                newStatus: "completed"
            });
            toast.success("Print order marked as completed");
            setOpenModalId(false);
        } catch (error) {
            console.error(`Failed to complete order: ${error}`);
            toast.error("Failed to mark print order as completed. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-primary mb-2">Customer Orders</h1>
                <p className="text-text-light">Manage and review all print orders submitted by customers.</p>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full divide-y divide-border-light table-fixed">
                    <thead className="bg-bg-soft">
                        <tr>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">File</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border-light">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-lg text-gray-500">
                                    No print orders yet.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-primary">{order.customer?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                        <span>{order.filename}</span>
                                    </td>
                                    <td className={`uppercase font-semibold text-center ${getPrintOrderStatus(order.status)}`}>{getStatus(order.status)}</td>
                                    <td className="px-6 py-4 text-md text-center text-primary">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 items-center justify-center">
                                        <div className="relative group">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="flex items-center justify-center cursor-pointer text-accent border border-border-light rounded p-2"
                                            >
                                                <FileText size={20} />
                                            </Link>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                                View Details
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <button
                                                onClick={() => setOpenModalId(order.id)}
                                                disabled={updateStatusMutation.isPending}
                                                className="flex items-center justify-center cursor-pointer text-accent border border-border-light rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Info size={20} />
                                            </button>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                                More Info
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal for specific print order */}
            {openModalId && selectedOrder && (
                <PrintOrderModal
                    order={selectedOrder}
                    onClose={handleCloseModal}
                    onReject={handleReject}
                    onReadyToPickup={handleReadyToPickup}
                    isSubmitting={updateStatusMutation.isPending}
                    onCompleteOrder={handleCompleteOrder}
                />
            )}
        </div>
    );
}