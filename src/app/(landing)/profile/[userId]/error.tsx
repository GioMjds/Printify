'use client';

import { ErrorPageProps } from "@/types/next-types";

export default function Error({ error, reset }: ErrorPageProps) {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-bg-primary to-bg-secondary">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Woah! An error occured!</h1>
                <p className="text-lg">{error.message || "Unknown error"}</p>
                <button
                    onClick={() => reset()}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    )
}