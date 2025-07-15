'use client';

import PrintOrderModal from "@/components/PrintOrderModal";
import { fetchAllPrintOrders } from "@/services/Admin";
import { useQuery } from "@tanstack/react-query";
import { FileText, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PrintOrder = {
    id: string;
    filename: string;
    fileData: string;
    status: string;
    needed_amount?: number;
    customer?: {
        name?: string;
        id?: string;
    };
    createdAt: string;
    updatedAt: string;
    format: string;
};

function getPrintOrderStatus(status: string) {
    switch (status) {
        case "pending":
            return "text-yellow-500";
        case "printing":
            return "text-blue-500";
        case "ready_to_pickup":
            return "text-green-500";
        case "completed":
            return "text-gray-500";
        case "cancelled":
            return "text-red-500";
        default:
            return "text-gray-500";
    }
}

export default function Orders() {
    const [openModalId, setOpenModalId] = useState<string | number | false>(false);

    const { data } = useQuery({
        queryKey: ['printOrders'],
        queryFn: () => fetchAllPrintOrders(),
    });

    const orders: PrintOrder[] = data?.printOrders || [];
    const selectedOrder = orders.find((order) => order.id === openModalId);

    const handleCloseModal = () => setOpenModalId(false);
    
    const handleReject = () => {
        // TODO: Implement reject logic (API call)
        setOpenModalId(false);
    };
    const handleReadyToPickup = () => {
        // TODO: Implement ready to pickup logic (API call)
        setOpenModalId(false);
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="mb-2">
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
                            orders.map((order) => (
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
                                        {/* Redirect to Order Details Button with Tooltip */}
                                        <div className="relative group">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="flex items-center justify-center cursor-pointer text-accent border border-border-light rounded p-2"
                                            >
                                                <FileText size={20} />
                                            </Link>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                                View Details
                                            </span>
                                        </div>
                                        {/* Open Modal Icon Button with Tooltip */}
                                        <div className="relative group">
                                            <button
                                                onClick={() => setOpenModalId(order.id)}
                                                className="flex items-center justify-center cursor-pointer text-accent border border-border-light rounded p-2"
                                            >
                                                <Info size={20} />
                                            </button>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                                More Info
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal for specific print order */}
            {openModalId && selectedOrder && (
                <PrintOrderModal
                    order={selectedOrder}
                    onClose={handleCloseModal}
                    onReject={handleReject}
                    onReadyToPickup={handleReadyToPickup}
                />
            )}
        </div>
    );
}