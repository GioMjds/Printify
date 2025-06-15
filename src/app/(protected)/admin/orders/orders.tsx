'use client';

import { fetchAllPrintOrders, downloadFile } from "@/services/Admin";
import { useQuery } from "@tanstack/react-query";
import { Download, Eye } from "lucide-react";
import Link from "next/link";

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
                        {orders.map((order: any) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-primary">{order.customer?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                    <span>{order.filename}</span>
                                </td>
                                <td className={`uppercase font-semibold text-center ${getPrintOrderStatus(order.status)}`}>{order.status}</td>
                                <td className="px-6 py-4 text-md text-center text-primary">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-center text-accent hover:text-accent-dark transition mr-2"
                                        title="View Order Details"
                                        aria-label={`View details for order ${order.id}`}
                                    >
                                        <Eye size={24} />
                                    </Link>
                                    <button
                                        onClick={() => downloadFile(order.id)}
                                        className="flex items-center justify-center text-primary hover:text-accent transition"
                                        title="Download File"
                                        aria-label={`Download file for order ${order.id}`}
                                    >
                                        <Download size={22} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}