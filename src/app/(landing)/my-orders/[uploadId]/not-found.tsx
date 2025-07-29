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
                className="container mx-auto px-4 sm:px-6 md:px-8 py-8 my-8 sm:my-12 md:my-16"
            >
                <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-5 md:p-6">
                        <motion.h1
                            className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Not Found
                        </motion.h1>
                        <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">
                            The order you&apos;re looking for doesn&apos;t exist
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] text-center">
                            {/* 404 Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="mb-4 sm:mb-5 md:mb-6"
                            >
                                <svg
                                    className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-accent"
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
                                className="space-y-3 sm:space-y-4"
                            >
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                                    Oops! Order Not Found
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                                    The order you&apos;re trying to access doesn&apos;t exist or may have been removed.
                                    Please check the order ID or return to your orders list.
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-sm"
                            >
                                <Link
                                    href="/my-orders"
                                    className="px-4 sm:px-5 py-2 sm:py-3 bg-accent text-white rounded-lg hover:bg-secondary transition-colors font-medium text-sm sm:text-base"
                                >
                                    View My Orders
                                </Link>
                                <Link
                                    href="/"
                                    className="px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center text-sm sm:text-base"
                                >
                                    Go Home
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-4 sm:px-5 py-2 sm:py-3 text-accent hover:text-secondary transition-colors font-medium text-center text-sm sm:text-base"
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