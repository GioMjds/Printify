'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PrintOrderModalProps {
    order: {
        id: string;
        filename: string;
        fileData: string;
        status: string;
        needed_amount?: number;
        customer?: { name?: string; id?: string };
        createdAt: string;
        updatedAt: string;
        format: string;
    };
    onClose: () => void;
    onReject: (orderId: string, reason: string) => void;
    onReadyToPickup: (orderId: string, amount: number) => void;
}

export default function PrintOrderModal({ order, onClose, onReject, onReadyToPickup }: PrintOrderModalProps) {
    const [amount, setAmount] = useState<number>(order.needed_amount || 0);
    const [rejectReason, setRejectReason] = useState<string>("");
    const [showRejectInput, setShowRejectInput] = useState<boolean>(false);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-border-light overflow-y-auto max-h-[95vh]"
            >
                <button
                    className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 text-4xl font-bold z-10"
                    onClick={onClose}
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
                        <span className="uppercase font-semibold text-primary">{order.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-text-light">Uploaded:</span>
                        <span className="text-primary">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                {/* File Preview */}
                <div className="mb-4">
                    {renderFilePreview()}
                </div>
                {/* Pending Status Actions */}
                {order.status === "pending" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="amount" className="font-semibold text-text-light">Set Amount: <span className="text-primary">₱</span></label>
                            <input
                                id="amount"
                                type="number"
                                min={0}
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                className="border border-border-light rounded px-2 py-1 w-24 text-primary"
                            />
                        </div>
                        <div className="flex gap-3 mt-2 justify-between">
                            <button
                                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                                onClick={() => setShowRejectInput(true)}
                            >
                                Reject Print Order
                            </button>
                            <button
                                className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                                onClick={() => onReadyToPickup(order.id, amount)}
                            >
                                Ready To Pickup
                            </button>
                        </div>
                        {showRejectInput && (
                            <div className="flex flex-col gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Enter rejection reason..."
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    className="border border-border-light rounded px-2 py-1 text-primary"
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
                                        onClick={() => onReject(order.id, rejectReason)}
                                        disabled={!rejectReason.trim()}
                                    >
                                        Confirm Reject
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-primary font-semibold px-3 py-1 rounded"
                                        onClick={() => setShowRejectInput(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
