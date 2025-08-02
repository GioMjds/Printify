"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { cancelPrintUpload, fetchCustomerPrintUploads } from "@/services/Customer";
import { formatDate, getStatus, getStatusColor } from "@/utils/formatters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MyOrdersProps, Upload, UploadResponse } from "@/types/MyOrders";
import CancellationModal from "@/components/CancellationModal";
import { cancellationReasons } from "@/constants/dropdown";
import { toast } from "react-toastify";

export default function MyOrdersPage({ userId, page, limit }: MyOrdersProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const { data } = useQuery<UploadResponse>({
        queryKey: ["myOrders", userId, page, limit],
        queryFn: () => fetchCustomerPrintUploads({ userId, page, limit }),
    });

    const cancelMutation = useMutation({
        mutationFn: ({ uploadId, cancelReason }: { uploadId: string; cancelReason: string }) =>
            cancelPrintUpload({ uploadId, cancelReason }),
        onSuccess: () => {
            setModalOpen(false);
            setSelectedUploadId(null);
            toast.success("Print order successfully cancelled.");
            queryClient.invalidateQueries({ queryKey: ["myOrders", userId, page, limit] });
        },
    });

    const uploads = data?.uploads || [];
    const pagination = data?.pagination;

    const setPage = (pageNum: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(pageNum));
        router.replace(`?${params.toString()}`);
    }

    const handlePrevPage = () => {
        if (pagination?.hasPreviousPage) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (pagination?.hasNextPage) setPage(page + 1);
    };

    const handlePageChange = (pageNum: number) => setPage(pageNum);

    const handleCancelOrder = (uploadId: string) => {
        setSelectedUploadId(uploadId);
        setModalOpen(true);
    };

    const handleCancelConfirm = (reason: string) => {
        if (selectedUploadId) cancelMutation.mutate({
            uploadId: selectedUploadId,
            cancelReason: reason
        })
    }

    const displayPriceOrCancel = (upload: Upload) => {
        if (upload.status === 'pending') {
            return (
                <button
                    className="px-3 py-1 cursor-pointer rounded-md bg-red-600 text-white text-sm sm:text-base hover:bg-red-700 transition-colors"
                    onClick={() => handleCancelOrder(upload.id)}
                >
                    Cancel Order
                </button>
            );
        } else if (upload.needed_amount) {
            return (
                <span className="px-2 py-1 rounded-md text-sm sm:text-base md:text-lg bg-bg-soft/10 text-bg-soft">
                    ₱{upload.needed_amount}
                </span>
            );
        }
        return null;
    }

    return (
        <section className="w-full min-h-screen py-6 md:py-10 mt-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-bg-accent opacity-20 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-bg-highlight opacity-15 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-0" />

            <div className="max-w-5xl mx-auto relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-bg-soft mb-6 md:mb-8 text-center tracking-tight">
                    My Print Orders
                </h1>
                {uploads.length > 0 ? (
                    <>
                        <motion.div
                            className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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
                                    className="glass-card p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 border border-[var(--color-border-light)] shadow-md hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-200 relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: idx * 0.08,
                                        type: "spring",
                                        stiffness: 60,
                                    }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                        <span className={`px-2 py-1 uppercase rounded-full text-xs font-semibold border transition-colors duration-200 ${getStatusColor(upload.status) ||
                                            "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                        >
                                            {getStatus(upload.status)}
                                        </span>
                                        <span className="ml-auto text-xs text-bg-soft/70">
                                            {formatDate(upload.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 sm:gap-2">
                                        <h2 className="text-sm sm:text-md font-semibold text-gray-200 truncate">
                                            {upload.filename}
                                        </h2>
                                    </div>
                                    <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-3 justify-between">
                                        <Link
                                            href={`/my-orders/${upload.id}`}
                                            className="text-sm sm:text-base md:text-lg text-bg-soft hover:text-bg-highlight font-medium transition-colors duration-200"
                                        >
                                            View Details
                                        </Link>
                                        {displayPriceOrCancel(upload)}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination Controls - Bottom */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-8 sm:mt-10 md:mt-12">
                                {/* Page Numbers */}
                                <div className="flex justify-center mb-3 sm:mb-4">
                                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={!pagination.hasPreviousPage}
                                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base ${pagination.hasPreviousPage
                                                ? "bg-bg-accent cursor-pointer text-white hover:bg-bg-highlight"
                                                : "bg-gray-300 cursor-not-allowed text-gray-500"
                                                }`}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                                            (pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${page === pageNum
                                                        ? "bg-bg-highlight text-white"
                                                        : "bg-bg-soft/20 text-bg-soft hover:bg-bg-soft/40"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        )}
                                        <button
                                            onClick={handleNextPage}
                                            disabled={!pagination.hasNextPage}
                                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base ${pagination.hasNextPage
                                                ? "bg-bg-accent cursor-pointer text-white hover:bg-bg-highlight"
                                                : "bg-gray-300 cursor-not-allowed text-gray-500"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
                        <Image
                            src="/file.svg"
                            alt="No Orders"
                            width={60}
                            height={60}
                            className="mb-3 sm:mb-4 opacity-70"
                        />
                        <p className="text-lg sm:text-xl text-bg-soft mb-3 sm:mb-4">
                            No print orders found.
                        </p>
                        <button
                            onClick={() => setPage(1)}
                            className="bg-bg-accent text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-bg-highlight transition-colors text-sm sm:text-base"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>
            <CancellationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleCancelConfirm}
                title="Cancel Print Order"
                description="Please provide a reason for cancelling this print order:"
                reasonLabel="Reason for Cancellation"
                reasonPlaceholder="Please explain why you're cancelling this print order..."
                confirmButtonText={cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
                showPolicyNote={false}
                reasons={cancellationReasons}
            />
        </section>
    );
}