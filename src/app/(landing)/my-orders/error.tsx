'use client';

import { ErrorPageProps } from "@/types/next-types";
import { motion } from "framer-motion";

export default function Error({ error, reset }: ErrorPageProps) {
    return (
        <section className="w-full min-h-screen py-6 md:py-10 mt-16 md:mt-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-bg-accent opacity-20 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-bg-highlight opacity-15 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-0" />

            <motion.div
                className="max-w-md mx-auto relative z-10 flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="glass-card p-6 sm:p-8 w-full text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 sm:mb-6 mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 sm:h-12 sm:w-12 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl font-bold text-bg-soft mb-2 sm:mb-3">
                        Something went wrong!
                    </h2>
                    <p className="text-bg-soft/80 mb-4 sm:mb-6 text-sm sm:text-base">
                        {error.message || "An unexpected error occurred."}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 sm:px-6 py-1 sm:py-2 bg-bg-accent text-white rounded-full hover:bg-bg-secondary transition-colors text-sm sm:text-base"
                        onClick={() => reset()}
                    >
                        Retry
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}