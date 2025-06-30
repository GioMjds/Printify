'use client';

import { fetchPrintOrder } from "@/services/Admin";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FetchSingleOrder({ orderId }: { orderId: string }) {
    const { data } = useQuery({
        queryKey: ['printOrder', orderId],
        queryFn: () => fetchPrintOrder({ uploadId: orderId }),
    });

    const isPDF = data?.filename?.toLowerCase().endsWith('.pdf');
    const isDocx = data?.filename?.toLowerCase().endsWith('.docx');
    const isDoc = data?.filename?.toLowerCase().endsWith('.doc');
    const fileUrl = data?.fileData;

    const renderFilePreview = () => {
        if (!fileUrl) {
            return <div className="text-gray-500">No file available for preview.</div>;
        }
        if (isPDF) {
            return (
                <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    className="w-full h-[600px] border rounded-lg"
                />
            );
        }
        if (isDocx || isDoc) {
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                    title="DOC/DOCX Preview"
                    className="w-full h-[600px] border rounded-lg"
                />
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-1">
            <div className="mb-4">
                <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 text-primary hover:underline"
                >
                    <ArrowLeft size={24} />
                    <span>Back to Orders</span>
                </Link>
            </div>
            <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-border-light"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Order Details */}
                    <div className="flex-1 flex flex-col gap-6 min-w-[400px]">
                        <h1 className="text-2xl font-bold text-primary mb-2">Order Details</h1>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-light">Filename:</span>
                                <span className="text-primary">{data.filename}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-light">Status:</span>
                                <span className="uppercase font-semibold text-primary">{data.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-light">Customer ID:</span>
                                <span className="text-primary">{data.customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-light">Created At:</span>
                                <span className="text-primary">{new Date(data.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-light">Last Updated:</span>
                                <span className="text-primary">{new Date(data.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    {/* File Preview (only on the right, using Office Online for doc/docx) */}
                    <div className="flex-1 flex flex-col gap-2 min-w-[350px]">
                        {renderFilePreview()}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}