"use client";

import { fetchCustomerPrintUploads } from "@/services/Customer";
import { formatDate, getStatus, getStatusColor } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, UploadResponse } from "@/types/MyOrders";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MyOrdersPage({ 
    userId, 
    initialPage = 1, 
    limit = 6 
}: { 
    userId: string; 
    initialPage?: number; 
    limit?: number; 
}) {
    const [page, setPage] = useState<number>(initialPage);
    
    const { data } = useQuery<UploadResponse>({
        queryKey: ["myOrders", userId, page],
        queryFn: () => fetchCustomerPrintUploads({ 
            userId, 
            page, 
            limit 
        }),
    }); 

    const uploads = data?.uploads || [];
    const pagination = data?.pagination;

    const handlePrevPage = () => {
        if (pagination?.hasPreviousPage) setPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (pagination?.hasNextPage) setPage(prev => prev + 1);
    };

    const handlePageChange = (pageNum: number) => {
        setPage(pageNum);
    };

    return (
        <section className="w-full min-h-screen py-10 mt-20 px-4 md:px-12 bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-bg-accent opacity-20 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight opacity-15 rounded-full blur-3xl z-0" />

            <div className="max-w-5xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-bg-soft mb-8 text-center tracking-tight">
                    My Print Orders
                </h1>

                {/* Pagination Controls - Top */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="text-bg-soft">
                            Showing {uploads.length} of {pagination.total} orders
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={!pagination.hasPreviousPage}
                                className={`px-4 py-2 rounded-md ${
                                    pagination.hasPreviousPage
                                        ? "bg-bg-accent text-white hover:bg-bg-highlight"
                                        : "bg-gray-300 cursor-not-allowed text-gray-500"
                                }`}
                            >
                                Previous
                            </button>
                            
                            <span className="text-bg-soft">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            
                            <button
                                onClick={handleNextPage}
                                disabled={!pagination.hasNextPage}
                                className={`px-4 py-2 rounded-md ${
                                    pagination.hasNextPage
                                        ? "bg-bg-accent text-white hover:bg-bg-highlight"
                                        : "bg-gray-300 cursor-not-allowed text-gray-500"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {uploads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Image
                            src="/file.svg"
                            alt="No Orders"
                            width={80}
                            height={80}
                            className="mb-4 opacity-70"
                        />
                        <p className="text-xl text-bg-soft mb-4">
                            No print orders found.
                        </p>
                        <button 
                            onClick={() => setPage(1)}
                            className="bg-bg-accent text-white px-4 py-2 rounded-md hover:bg-bg-highlight transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <>
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
                                            className={`px-2 py-1 uppercase rounded-full text-xs font-semibold border transition-colors duration-200 ${
                                                getStatusColor(upload.status) ||
                                                "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                        >
                                            {getStatus(upload.status)}
                                        </span>
                                        <span className="ml-auto text-xs text-bg-soft/70">
                                            {formatDate(upload.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <h2 className="text-md font-semibold text-gray-200 truncate">
                                            {upload.filename}
                                        </h2>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Link
                                            href={`/my-orders/${upload.id}`}
                                            className="text-bg-soft hover:text-bg-highlight hover:underline text-sm font-medium transition-colors duration-200"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination Controls - Bottom */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-12">
                                {/* Page Numbers */}
                                <div className="flex justify-center mb-4">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                                            (pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        page === pageNum
                                                            ? "bg-bg-highlight text-white"
                                                            : "bg-bg-soft/20 text-bg-soft hover:bg-bg-soft/40"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Pagination Info */}
                                <div className="text-center text-bg-soft text-sm">
                                    Showing {Math.min(pagination.limit * (pagination.page - 1) + 1, pagination.total)}-
                                    {Math.min(pagination.limit * pagination.page, pagination.total)} of {pagination.total} orders
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}