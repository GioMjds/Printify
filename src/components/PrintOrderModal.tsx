'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CancellationModal from "./CancellationModal";
import { rejectionReasons } from "@/constants/dropdown";
import { getStatus } from "@/utils/formatters";
import { PrintOrderModalProps } from "@/types/Modal";

export default function PrintOrderModal({ order, onClose, onReject, onReadyToPickup, isSubmitting, onCompleteOrder }: PrintOrderModalProps) {
    const [amount, setAmount] = useState<number>(order.needed_amount || 0);
    const [showCancellationModal, setShowCancellationModal] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const isPDF = order.filename?.toLowerCase().endsWith('.pdf');
    const isDocx = order.filename?.toLowerCase().endsWith('.docx');
    const isDoc = order.filename?.toLowerCase().endsWith('.doc');
    const fileUrl = order.fileData;

    const renderFilePreview = () => {
        if (!fileUrl) {
            return <div className="text-gray-500">No file available for preview.</div>;
        }
        if (isPDF) {
            return (
                <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    className="w-full h-[400px] border rounded-lg"
                />
            );
        }
        if (isDocx || (isDoc && !isPDF)) {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                    title="DOC/DOCX Preview"
                    className="w-full h-[400px] border rounded-lg"
                />
            );
        }
        return <div className="text-gray-500">Unsupported file format.</div>;
    };

    const handleRejectConfirm = async (reason: string) => {
        try {
            await onReject(order.id, reason);
            setShowCancellationModal(false);
        } catch (error) {
            console.error("Error rejecting print order:", error);
        }
    };

    const handleReadyToPickupClick = async () => {
        if (amount <= 0) {
            alert("Please set a valid amount before marking as ready for pickup.");
            return;
        }
        try {
            await onReadyToPickup(order.id, amount);
        } catch (error) {
            console.error(`Ready to pickup failed: ${error}`);
        }
    };

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="relative max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-border-light overflow-y-auto max-h-[95vh]"
                >
                    <button
                        className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 text-4xl font-bold z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold text-primary">Order Details</h2>
                    <div className="flex flex-col gap-2 mb-4">
                        <div className="flex justify-between">
                            <span className="font-semibold text-text-light">Customer:</span>
                            <span className="text-primary">{order.customer?.name || order.customer?.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-text-light">Filename:</span>
                            <span className="text-primary">{order.filename}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-text-light">Status:</span>
                            <span className="uppercase font-semibold text-primary">{getStatus(order.status)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-text-light">Uploaded:</span>
                            <span className="text-primary">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        {order.needed_amount && (
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-light">Amount:</span>
                                <span className="text-primary">₱{order.needed_amount}</span>
                            </div>
                        )}
                    </div>

                    {/* File Preview */}
                    <div className="mb-4">
                        {renderFilePreview()}
                    </div>

                    {/* Pending Status Actions */}
                    {order.status === "pending" && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <label htmlFor="amount" className="font-semibold text-text-light">
                                    Set Amount: <span className="text-primary">₱</span>
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    min={0}
                                    value={amount}
                                    onChange={e => setAmount(Number(e.target.value))}
                                    className="border border-border-light rounded px-2 py-1 w-24 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex gap-3 mt-2 justify-between">
                                <button
                                    className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => setShowCancellationModal(true)}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Reject Print Order"}
                                </button>
                                <button
                                    className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={handleReadyToPickupClick}
                                    disabled={isSubmitting || amount <= 0}
                                >
                                    {isSubmitting ? "Processing..." : "Ready To Pickup"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Ready to Pickup Status Action */}
                    {order.status === "ready_to_pickup" && (
                        <div className="flex justify-center">
                            <button
                                className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                onClick={() => onCompleteOrder(order.id)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Mark as Completed"}
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Cancellation/Rejection Modal */}
                <CancellationModal
                    isOpen={showCancellationModal}
                    onClose={() => !isSubmitting && setShowCancellationModal(false)}
                    onConfirm={handleRejectConfirm}
                    title="Reject Print Order"
                    description="Please provide a reason for rejecting this print order:"
                    reasonLabel="Reason for Rejection"
                    reasonPlaceholder="Please explain why you're rejecting this print order..."
                    confirmButtonText="Confirm Rejection"
                    showPolicyNote={true}
                    reasons={rejectionReasons}
                />
            </div>
        </AnimatePresence>
    );
}