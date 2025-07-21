'use client';

import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CancellationModalProps } from '@/types/Modal';

const CancellationModal: FC<CancellationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Reject Print Order",
    description = "Please provide a reason for rejecting this print order:",
    reasonLabel = "Reason for Rejection",
    reasonPlaceholder = "Please explain why you're rejecting this print order...",
    confirmButtonText = "Confirm Rejection",
    showPolicyNote = true,
    reasons
}) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [otherReason, setOtherReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const isOther = selectedReason === 'Other (please specify)';
    const dropdownReasons = reasons || [];

    const handleConfirm = () => {
        const reasonToSend = isOther ? otherReason.trim() : selectedReason;
        if (!reasonToSend) {
            setError(isOther ? 'Please specify your reason for rejection.' : `Please select a ${reasonLabel.toLowerCase()}`);
            return;
        }
        setError('');
        setIsSubmitting(true);
        onConfirm(reasonToSend);
    };

    useEffect(() => {
        if (isOpen) {
            setSelectedReason('');
            setOtherReason('');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        key="modal-content"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
                    >
                        <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>

                        <p className="text-text-light mb-4">
                            {description}
                        </p>

                        <div className="mb-4">
                            <label htmlFor="reason-select" className="block text-sm font-medium text-text-light mb-1">
                                {reasonLabel} <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="reason-select"
                                className={`w-full px-3 py-2 border ${error && !isOther ? 'border-red-500' : 'border-border-light'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent`}
                                value={selectedReason}
                                onChange={e => {
                                    setSelectedReason(e.target.value);
                                    setError('');
                                }}
                            >
                                <option disabled value="">Select a reason...</option>
                                {dropdownReasons.map((reason) => (
                                    <option key={reason} value={reason}>{reason}</option>
                                ))}
                            </select>
                        </div>

                        {isOther && (
                            <div className="mb-4">
                                <label htmlFor="other-reason" className="block text-sm font-medium text-text-light mb-1">
                                    Please specify your reason <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="other-reason"
                                    rows={4}
                                    className={`w-full px-3 py-2 border ${error && isOther ? 'border-red-500' : 'border-border-light'} rounded-md focus:outline-none focus:ring-2 resize-none focus:ring-accent`}
                                    value={otherReason}
                                    onChange={e => {
                                        setOtherReason(e.target.value);
                                        setError('');
                                    }}
                                    placeholder={reasonPlaceholder}
                                />
                                {error && isOther && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                        )}
                        {error && !isOther && <p className="text-red-500 text-sm mb-2">{error}</p>}

                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 cursor-pointer bg-gray-200 text-primary rounded-md hover:bg-gray-300 transition-colors"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'} transition-colors`}
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : confirmButtonText}
                            </button>
                        </div>

                        {showPolicyNote && (
                            <p className="text-xs text-text-light mt-4">
                                Please note: Rejections will be notified to the customer.
                                View our <a href="#" className="text-accent hover:underline">Print Policy</a> for more information.
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CancellationModal;