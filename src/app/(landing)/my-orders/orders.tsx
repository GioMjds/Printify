"use client";

import { fetchCustomerPrintUploads } from "@/services/Customer";
import { formatDate, getStatusColor } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, UploadResponse } from "@/types/MyOrders";
import Image from "next/image";
import Link from "next/link";

export default function MyOrdersPage({ userId }: { userId: string }) {
    const { data } = useQuery<UploadResponse>({
        queryKey: ["myOrders", userId],
        queryFn: () => fetchCustomerPrintUploads({ userId }),
        enabled: !!userId,
    }); 

    const uploads = data?.uploads || [];

    return (
        <section className="w-full min-h-screen py-10 mt-20 px-4 md:px-12 bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-bg-accent opacity-20 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight opacity-15 rounded-full blur-3xl z-0" />

            <div className="max-w-5xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-bg-soft mb-8 text-center tracking-tight">
                    My Print Orders
                </h1>
                {uploads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Image
                            src="/file.svg"
                            alt="No Orders"
                            width={80}
                            height={80}
                            className="mb-4 opacity-70"
                        />
                        <p className="text-xl text-bg-soft">
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
                        {uploads.map((upload: Upload, idx: number) => (
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
                                        className={`px-3 py-1 uppercase rounded-full text-xs font-semibold border ${getStatusColor(upload.status) ||
                                            "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                    >
                                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                                    </span>
                                    <span className="ml-auto text-xs text-bg-soft/70">
                                        {formatDate(upload.createdAt)}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <h2 className="text-lg font-semibold text-bg-primary truncate">
                                        {upload.filename}
                                    </h2>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Link
                                        href={`/my-orders/${upload.id}`}
                                        className="text-bg-soft hover:text-bg-highlight hover:underline text-sm font-medium transition-colors duration-200"
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