'use client';

import { fetchPrintOrder } from "@/services/Admin";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function FetchSingleOrder({ orderId }: { orderId: string }) {
    const { data } = useQuery({
        queryKey: ['printOrder', orderId],
        queryFn: () => fetchPrintOrder({ uploadId: orderId }),
    });

    return (
        <motion.div
            className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10 flex flex-col gap-6 border border-border-light"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <h1 className="text-2xl font-bold text-primary mb-2">Order Details</h1>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="font-semibold text-text-light">Order ID:</span>
                    <span className="text-primary">{data.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-text-light">Filename:</span>
                    <span className="text-primary">{data.filename}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-text-light">Status:</span>
                    <span className="uppercase font-semibold px-3 py-1 rounded-full bg-bg-soft text-primary border border-border-light">{data.status}</span>
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
        </motion.div>
    );
}