'use client';

import { fetchSinglePrintUpload } from "@/services/Customer";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getStatus, getStatusColor } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GetSingleOrderPage({ uploadId }: { uploadId: string }) {
    const { data } = useQuery({
        queryKey: ['singleOrder', uploadId],
        queryFn: () => fetchSinglePrintUpload({ uploadId }),
    });

    const router = useRouter();

    const isPDF = data?.filename?.toLowerCase().endsWith('.pdf');
    const isDocx = data?.filename?.toLowerCase().endsWith('.docx');
    const isDoc = data?.filename?.toLowerCase().endsWith('.doc');
    const isImage = data?.fileData?.match(/\.(jpeg|jpg|gif|png)$/i);
    const fileUrl = data?.fileData;

    const renderFilePreview = () => {
        if (!fileUrl) return <div className="text-gray-500 text-center">No file available for preview.</div>;

        if (isPDF) {
            return (
                <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    className="w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border-0 rounded-lg"
                />
            );
        }

        if (isDocx || isDoc) {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                    title="DOC/DOCX Preview"
                    className="w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border-0 rounded-lg"
                />
            );
        }

        if (isImage) {
            return (
                <div className="w-full h-full flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
                    <Image
                        src={fileUrl}
                        alt="Upload preview"
                        className="max-h-full max-w-full object-contain rounded-lg"
                        width={800}
                        height={600}
                    />
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] text-[var(--color-text-light)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                </svg>
                <p className="text-base sm:text-lg md:text-xl font-medium mb-4">Document Preview</p>
                <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-colors text-sm sm:text-base"
                >
                    Download File
                </Link>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 sm:px-6 md:px-8 py-8 my-14 sm:my-20 md:my-16"
            >
                <motion.button
                    onClick={() => router.push('/my-orders')}
                    className="flex items-center gap-2 text-white hover:text-highlight mb-4 sm:mb-6 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm sm:text-md">
                        Back to My Orders
                    </span>
                </motion.button>
                <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-4 sm:p-5 md:p-6">
                        <motion.h1
                            className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Details
                        </motion.h1>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                            {/* Order Information */}
                            <motion.div
                                className="space-y-4 sm:space-y-5 md:space-y-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="space-y-3 sm:space-y-4">
                                    <DetailItem label="File Name" value={data?.filename || 'Loading...'} />
                                    <DetailItem
                                        label="Status"
                                        value={
                                            <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full uppercase text-xs sm:text-sm font-medium border ${getStatusColor(data?.status)}`}>
                                                {getStatus(data?.status)}
                                            </span>
                                        }
                                    />
                                    <DetailItem
                                        label="Date Uploaded"
                                        value={data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'Loading...'}
                                    />
                                    <DetailItem
                                        label="Updated"
                                        value={data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Loading...'}
                                    />
                                    {data?.needed_amount && (
                                        <DetailItem label="Amount" value={`₱${data.needed_amount}`} />
                                    )}
                                    {data?.rejection_reason && (
                                        <DetailItem
                                            label="Rejection Reason"
                                            value={
                                                <span className="text-red-600 font-medium text-sm sm:text-base">{data.rejection_reason}</span>
                                            }
                                        />
                                    )}
                                    {data?.cancel_reason && (
                                        <DetailItem
                                            label="Cancellation Reason"
                                            value={
                                                <span className="text-red-600 font-medium text-sm sm:text-base">{data.cancel_reason}</span>
                                            }
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* File Preview */}
                            <motion.div
                                className="flex flex-col mt-6 lg:mt-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-3 sm:mb-4">File Preview</h2>
                                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-1">
                                    {renderFilePreview()}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <motion.div
        className="flex flex-col sm:flex-row border-b border-border-light pb-2 sm:pb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
    >
        <strong className="w-full sm:w-32 md:w-40 text-sm sm:text-base mb-1 sm:mb-0">{label}:</strong>
        <span className="flex-1 text-sm sm:text-base">{value}</span>
    </motion.div>
);