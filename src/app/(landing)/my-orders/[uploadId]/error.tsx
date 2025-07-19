'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function OrderError({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Order page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto p-8 m-16"
            >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                        <motion.h1
                            className="text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Error
                        </motion.h1>
                        <p className="text-white/80 mt-2">Something went wrong while loading your order</p>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                            {/* Error Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="mb-6"
                            >
                                <svg
                                    className="w-20 h-20 text-red-500 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Oops! Something went wrong
                                </h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    We encountered an error while trying to load your order details.
                                    This could be due to a network issue or the order might not exist.
                                </p>

                                {/* Error Details (only in development) */}
                                {process.env.NODE_ENV === 'development' && (
                                    <details className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                                        <summary className="cursor-pointer font-medium text-gray-700">
                                            Error Details (Development)
                                        </summary>
                                        <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                                            {error.message}
                                        </pre>
                                    </details>
                                )}
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 mt-8"
                            >
                                <button
                                    onClick={reset}
                                    className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-colors font-medium"
                                >
                                    Try Again
                                </button>
                                <Link
                                    href="/my-orders"
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                                >
                                    Back to Orders
                                </Link>
                                <Link
                                    href="/"
                                    className="px-6 py-3 text-[var(--color-accent)] hover:text-[var(--color-secondary)] transition-colors font-medium text-center"
                                >
                                    Go Home
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}