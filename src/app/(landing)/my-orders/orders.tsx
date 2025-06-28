"use client";

import { fetchCustomerPrintUploads } from "@/services/Customer";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    printing: "bg-blue-100 text-blue-800 border-blue-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
    ready_to_pickup: "bg-purple-100 text-purple-800 border-purple-300",
    completed: "bg-green-100 text-green-800 border-green-300",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function MyOrdersPage({ userId }: { userId: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["myOrders", userId],
        queryFn: () => fetchCustomerPrintUploads({ userId }),
        enabled: !!userId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <span className="loader mb-4" />
                <p className="text-lg text-primary">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-lg text-red-600">Failed to load orders.</p>
            </div>
        );
    }

    const uploads = data?.uploads || [];

    return (
        <section className="w-full min-h-screen py-10 mt-20 px-4 md:px-12 bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-bg-white)]">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center tracking-tight">
                    My Print Orders
                </h1>
                {uploads.length < 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Image
                            src="/file.svg"
                            alt="No Orders"
                            width={80}
                            height={80}
                            className="mb-4 opacity-70"
                        />
                        <p className="text-xl text-[var(--color-text-light)]">
                            No print orders found.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.12,
                                },
                            },
                        }}
                    >
                        {uploads.map((upload: any, idx: number) => (
                            <motion.div
                                key={upload.id}
                                className="glass-card p-6 flex flex-col gap-4 border border-[var(--color-border-light)] shadow-lg hover:shadow-xl transition-shadow duration-200 relative"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: idx * 0.08,
                                    type: "spring",
                                    stiffness: 60,
                                }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[upload.status] ||
                                            "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                    >
                                        {upload.status
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, (c: any) => c.toUpperCase())}
                                    </span>
                                    <span className="ml-auto text-xs text-gray-500">
                                        {formatDate(upload.createdAt)}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">
                                        {upload.filename}
                                    </h2>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Link
                                        href={upload.fileData}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--color-secondary)] hover:underline text-sm font-medium"
                                    >
                                        View File
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}