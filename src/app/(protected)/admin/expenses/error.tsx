"use client";

import { ErrorPageProps } from "@/types/next-types";
import { motion } from "framer-motion";

export default function ErrorBoundary({ error, reset }: ErrorPageProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
            >
                <h2 className="text-3xl font-bold text-red-600 mb-2">Something went wrong</h2>
                <p className="text-red-500 mb-4">{error.message || "An unexpected error occurred."}</p>
                <button
                    onClick={() => reset()}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                    Try Again
                </button>
            </motion.div>
        </div>
    );
}

