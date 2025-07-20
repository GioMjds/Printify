'use client';

import { ErrorPageProps } from "@/types/next-types";
import { motion } from "framer-motion";

export default function Error({ error, reset }: ErrorPageProps) {
    return (
        <section className="w-full min-h-screen py-10 mt-20 px-4 md:px-12 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-bg-accent opacity-20 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight opacity-15 rounded-full blur-3xl z-0" />

            <motion.div
                className="max-w-5xl mx-auto relative z-10 flex flex-col items-center justify-center min-h-[60vh]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="glass-card p-8 max-w-md w-full text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-red-500"
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
                    <h2 className="text-2xl font-bold text-bg-soft mb-3">
                        Something went wrong!
                    </h2>
                    <p className="text-bg-soft/80 mb-6">
                        {error.message || "An unexpected error occurred."}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 bg-bg-accent text-white rounded-full hover:bg-bg-secondary transition-colors"
                        onClick={() => reset()}
                    >
                        Retry
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}