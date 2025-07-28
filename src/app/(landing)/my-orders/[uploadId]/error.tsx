'use client';

import { ErrorPageProps } from "@/types/next-types";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrderError({ error, reset }: ErrorPageProps) {
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
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-5 md:p-6">
                        <motion.h1
                            className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Error
                        </motion.h1>
                        <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">
                            Something went wrong while loading your order
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] text-center">
                            {/* Error Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="mb-4 sm:mb-5 md:mb-6"
                            >
                                <svg
                                    className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-red-500 mb-3 sm:mb-4"
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
                                className="space-y-3 sm:space-y-4"
                            >
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                                    Oops! Something went wrong
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                                    We encountered an error while trying to load your order details.
                                    This could be due to a network issue or the order might not exist.
                                </p>

                                {/* Error Details (only in development) */}
                                {process.env.NODE_ENV === 'development' && (
                                    <details className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-100 rounded-lg text-left">
                                        <summary className="cursor-pointer font-medium text-gray-700 text-sm sm:text-base">
                                            Error Details (Development)
                                        </summary>
                                        <pre className="mt-2 text-xs sm:text-sm text-red-600 whitespace-pre-wrap">
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
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-sm"
                            >
                                <button
                                    onClick={reset}
                                    className="px-4 sm:px-5 py-2 sm:py-3 bg-accent text-white rounded-lg hover:bg-secondary transition-colors font-medium text-sm sm:text-base"
                                >
                                    Try Again
                                </button>
                                <Link
                                    href="/my-orders"
                                    className="px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center text-sm sm:text-base"
                                >
                                    Back to Orders
                                </Link>
                                <Link
                                    href="/"
                                    className="px-4 sm:px-5 py-2 sm:py-3 text-accent hover:text-secondary transition-colors font-medium text-center text-sm sm:text-base"
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