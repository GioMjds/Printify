'use client';

import { fetchAllPrintOrders } from "@/services/Admin";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Orders() {
    const { data } = useQuery<any>({
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
                <table className="min-w-full divide-y divide-border-light">
                    <thead className="bg-bg-soft">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">File</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border-light">
                        {orders.map((order: any) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{order.customer?.name || order.customer?.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                    <Link
                                        href={order.fileData}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        View File
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap uppercase text-sm text-primary">{order.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="text-primary hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}