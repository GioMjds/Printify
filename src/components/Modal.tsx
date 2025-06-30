'use client';

import { AnimatePresence, motion } from "framer-motion";
import { FC, MouseEvent, ReactNode, useCallback, useEffect } from "react";

interface ModalProps {
    icon?: string | ReactNode;
    title: string;
    description?: string;
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    className?: string;
    isOpen: boolean;
    loading?: boolean;
    loadingText?: string;
}

const Modal: FC<ModalProps> = ({
    icon,
    title,
    description,
    onCancel,
    onConfirm,
    cancelText = "Cancel",
    confirmText = "Confirm",
    className,
    isOpen,
    loading = false,
    loadingText = "Processing...",
}) => {
    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleConfirm = useCallback(() => {
        onConfirm();
    }, [onConfirm]);

    const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) handleCancel();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCancel();
        };

        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleCancel]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/65'
                    onClick={handleBackdropClick}
                >
                    {/* Modal Container */}
                    <div className="flex items-center justify-center min-h-screen px-4 text-center pointer-events-none">
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={`relative inline-block w-full border-1 border-border-light max-w-md p-6 text-left align-middle rounded-2xl shadow-xl pointer-events-auto ${className}`}
                            style={{
                                background: 'var(--gradient-primary)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    {icon && (
                                        <div className="p-2 rounded-lg bg-bg-secondary">
                                            <span>{icon}</span>
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-accent">
                                        {title}
                                    </h3>
                                </div>
                                <button
                                    onClick={onCancel}
                                    className="p-1 rounded-full cursor-pointer text-bg-soft hover:bg-accent/20 transition-colors"
                                    disabled={loading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="bg-bg-secondary/90 backdrop-blur-sm rounded-xl p-6 shadow-inner">
                                {description && (
                                    <p className="text-white mb-6">
                                        {description}
                                    </p>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-end">
                                    <button
                                        onClick={onCancel}
                                        className="px-4 py-2 cursor-pointer rounded-lg bg-bg-accent text-white hover:bg-accent/20 transition-colors"
                                        disabled={loading}
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className={`px-4 py-2 rounded-lg bg-accent text-white transition-colors flex items-center gap-2 min-w-[120px] justify-center
                                            ${loading ? 'bg-accent/50 cursor-not-allowed' : 'hover:bg-accent/50 cursor-pointer'}`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                                </svg>
                                                <span className="ml-2">{loadingText}</span>
                                            </>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal