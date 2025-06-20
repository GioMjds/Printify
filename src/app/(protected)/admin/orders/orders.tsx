'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { downloadFile, fetchAllPrintOrders } from "@/services/Admin";
import { FileText, Info } from "lucide-react";
import Modal from "@/components/Modal";

function getPrintOrderStatus(status: string) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 rounded-full px-3 py-1";
        case "printing":
            return "bg-blue-100 text-blue-800 rounded-full px-3 py-1";
        case "ready_to_pickup":
            return "bg-green-100 text-green-800 rounded-full px-3 py-1";
        case "completed":
            return "bg-gray-200 text-gray-700 rounded-full px-3 py-1";
        case "cancelled":
            return "bg-red-100 text-red-800 rounded-full px-3 py-1";
        default:
            return "bg-gray-100 text-gray-700 rounded-full px-3 py-1";
    }
}

export default function Orders() {
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    
    const { data } = useQuery({
        queryKey: ['printOrders'],
        queryFn: () => fetchAllPrintOrders(),
    });

    const orders = data?.printOrders || [];

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Customer Orders</h1>
                <p className="text-text-light">Manage and review all print orders submitted by customers.</p>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full divide-y divide-border-light table-fixed">
                    <thead className="bg-bg-soft">
                        <tr>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">File</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border-light">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-lg text-gray-500">
                                    No print orders yet.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order: any) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-primary">{order.customer?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                        <span>{order.filename}</span>
                                    </td>
                                    <td className={`uppercase font-semibold text-center ${getPrintOrderStatus(order.status)}`}>{order.status}</td>
                                    <td className="px-6 py-4 text-md text-center text-primary">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 items-center justify-center">
                                        {/* View File Icon Button */}
                                        <button
                                            onClick={() => downloadFile(order.id)}
                                            className="flex items-center justify-center text-secondary hover:text-accent transition border border-border-light rounded p-2"
                                            title="View Uploaded File"
                                            aria-label={`View uploaded file for order ${order.id}`}
                                        >
                                            <FileText size={20} />
                                        </button>
                                        {/* Open Modal Icon Button */}
                                        <button
                                            onClick={() => setOpenModalId(order.id)}
                                            className="flex items-center justify-center text-accent hover:text-primary transition border border-border-light rounded p-2"
                                            title="Open Modal"
                                            aria-label={`Open modal for order ${order.id}`}
                                        >
                                            <Info size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Empty Modal (no functionality yet) */}
            {openModalId && (
                <Modal
                    isOpen={!!openModalId}
                    onCancel={() => setOpenModalId(null)}
                    onConfirm={() => setOpenModalId(null)}
                    title="Order Modal"
                    description=""
                    confirmText="Close"
                    cancelText="Cancel"
                >
                    {/* Modal content will go here */}
                </Modal>
            )}
        </div>
    );
}