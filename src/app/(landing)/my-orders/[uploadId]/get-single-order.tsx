'use client';

import { fetchSinglePrintUpload } from "@/services/Customer";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getStatusColor } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";

interface GetSingleOrderPageProps {
    uploadId: string;
}

export default function GetSingleOrderPage({ uploadId }: GetSingleOrderPageProps) {
    const { data } = useQuery({
        queryKey: ['singleOrder', uploadId],
        queryFn: () => fetchSinglePrintUpload({ uploadId }),
    });

    const isPDF = data?.filename?.toLowerCase().endsWith('.pdf');
    const isDocx = data?.filename?.toLowerCase().endsWith('.docx');
    const isDoc = data?.filename?.toLowerCase().endsWith('.doc');
    const isImage = data?.fileData?.match(/\.(jpeg|jpg|gif|png)$/i);
    const fileUrl = data?.fileData;

    const renderFilePreview = () => {
        if (!fileUrl) {
            return <div className="text-gray-500 text-center">No file available for preview.</div>;
        }

        if (isPDF) {
            return (
                <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    className="w-full h-full border-0 rounded-lg"
                />
            );
        }

        if (isDocx || isDoc) {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                    title="DOC/DOCX Preview"
                    className="w-full h-full border-0 rounded-lg"
                />
            );
        }

        if (isImage) {
            return (
                <div className="w-full h-full flex items-center justify-center">
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
            <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-light)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                </svg>
                <p className="text-lg font-medium mb-4">Document Preview</p>
                <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
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
                className="container mx-auto p-8 m-16"
            >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6">
                        <motion.h1
                            className="text-3xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Details
                        </motion.h1>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* Order Information */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="space-y-4">
                                    <DetailItem label="File Name" value={data?.filename || 'Loading...'} />
                                    <DetailItem
                                        label="Status"
                                        value={
                                            <span className={`px-3 py-1 rounded-full uppercase text-sm font-medium border ${getStatusColor(data?.status || 'pending')}`}>
                                                {data?.status?.replace('_', ' ')}
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
                                        <DetailItem label="Amount" value={`$${data.needed_amount}`} />
                                    )}
                                    {data?.rejection_reason && (
                                        <DetailItem
                                            label="Rejection Reason"
                                            value={
                                                <span className="text-red-600 font-medium">{data.rejection_reason}</span>
                                            }
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* File Preview */}
                            <motion.div
                                className="flex flex-col"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">File Preview</h2>
                                <div className="bg-gray-50 rounded-2xl p-4 flex-1 min-h-[600px]">
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
        className="flex border-b border-border-light pb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
    >
        <strong className="w-40">{label}:</strong>
        <span className="flex-1">{value}</span>
    </motion.div>
);