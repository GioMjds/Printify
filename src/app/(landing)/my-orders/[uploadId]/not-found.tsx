'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
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
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6">
                        <motion.h1
                            className="text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Not Found
                        </motion.h1>
                        <p className="text-white/80 mt-2">The order you're looking for doesn't exist</p>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                            {/* 404 Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="mb-6"
                            >
                                <svg
                                    className="w-20 h-20 text-[var(--color-accent)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                                    Oops! Order Not Found
                                </h2>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    The order you're trying to access doesn't exist or may have been removed.
                                    Please check the order ID or return to your orders list.
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 mt-8"
                            >
                                <Link
                                    href="/my-orders"
                                    className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-colors font-medium"
                                >
                                    View My Orders
                                </Link>
                                <Link
                                    href="/"
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                                >
                                    Go Home
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 text-[var(--color-accent)] hover:text-[var(--color-secondary)] transition-colors font-medium text-center"
                                >
                                    Contact Support
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}