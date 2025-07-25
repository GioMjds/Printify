'use client';

import { Info } from "lucide-react";
import { useState } from "react";
import PrintOrderModal from "./PrintOrderModal";
import { PrintOrder } from "@/types/Admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateUploadStatus } from "@/services/Admin";

interface OrderActionsProps {
    order: PrintOrder;
}

export default function OrderActions({ order }: OrderActionsProps) {
    const [openModalId, setOpenModalId] = useState<string | number | false>(false);
    const queryClient = useQueryClient();

    const updateStatusMutation = useMutation({
        mutationFn: ({
            uploadId,
            newStatus,
            rejectionReason,
            amount
        }: {
            uploadId: string;
            newStatus: string;
            rejectionReason?: string;
            amount?: number;
        }) => updateUploadStatus({ uploadId, newStatus, rejectionReason, amount }),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: ['printOrders'],
            });
            toast.success("Status updated successfully");
            setOpenModalId(false);
        },
        onError: (error: Error) => {
            console.error(`Failed to update order status: ${error}`);
            toast.error("Failed to update print order status. Please try again.");
        }
    });

    const handleReject = async (orderId: string, reason: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                uploadId: orderId,
                newStatus: "rejected",
                rejectionReason: reason
            });
        } catch (error) {
            console.error(`Failed to reject order: ${error}`);
            throw error;
        }
    };

    const handleReadyToPickup = async (orderId: string, amount: number) => {
        try {
            await updateStatusMutation.mutateAsync({
                uploadId: orderId,
                newStatus: "ready_to_pickup",
                amount
            });
            toast.success(`Print order marked as ready for pickup with amount ₱${amount}`);
        } catch (error) {
            console.error(`Failed to mark order as ready: ${error}`);
            throw error;
        }
    };

    const handleCompleteOrder = async (orderId: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                uploadId: orderId,
                newStatus: "completed"
            });
            toast.success("Print order marked as completed");
        } catch (error) {
            console.error(`Failed to complete order: ${error}`);
            throw error;
        }
    };

    return (
        <>
            <div className="relative group">
                <button
                    onClick={() => setOpenModalId(order.id)}
                    className="flex items-center justify-center cursor-pointer text-accent border border-border-light rounded p-2"
                >
                    <Info size={20} />
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                    More Info
                </span>
            </div>

            {openModalId === order.id && (
                <PrintOrderModal
                    order={order}
                    onClose={() => setOpenModalId(false)}
                    onReject={handleReject}
                    onReadyToPickup={handleReadyToPickup}
                    isSubmitting={updateStatusMutation.isPending}
                    onCompleteOrder={handleCompleteOrder}
                />
            )}
        </>
    );
}