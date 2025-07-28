"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SuccessFallback() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary p-4 sm:p-6">
            <motion.div
                className="bg-white/90 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-4 sm:mb-6"
                >
                    <svg
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent mx-auto mb-3 sm:mb-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#E3D095" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2l4-4" stroke="#0E2148" />
                    </svg>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-2 text-center">
                        File Submitted Successfully!
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-text-light text-center">
                        Your document has been submitted for print. We will notify you once your order is processed.
                    </p>
                </motion.div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
                    <Link
                        href="/my-orders"
                        className="bg-accent text-white px-4 sm:px-5 py-2 rounded-lg font-bold shadow hover:bg-highlight transition-colors duration-200 text-center text-sm sm:text-base"
                    >
                        See My Orders
                    </Link>
                    <Link
                        href="/"
                        className="bg-bg-highlight text-primary px-4 sm:px-5 py-2 rounded-lg font-bold shadow hover:bg-accent hover:text-white transition-colors duration-200 text-center text-sm sm:text-base"
                    >
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}