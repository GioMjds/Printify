'use client';

import { fetchAllPrintOrders } from "@/services/Admin";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";

export default function Orders() {
    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['printOrders'],
        queryFn: () => fetchAllPrintOrders(),
    });

    const orders = data?.printOrders || [];

    return (
        <div className="min-h-screen bg-[var(--color-bg-white)] p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">Customer Orders</h1>
                <p className="text-[var(--color-text-light)]">Manage and review all print orders submitted by customers.</p>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-[var(--color-bg-white)]">
                <Suspense fallback={<h1>Loading...</h1>}>
                    <table className="min-w-full divide-y divide-[var(--color-border-light)]">
                        <thead className="bg-[var(--color-bg-soft)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">File</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[var(--color-border-light)]">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                            ) : isError ? (
                                <tr><td colSpan={6} className="text-center py-8 text-red-500">Failed to load orders.</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8">No orders found.</td></tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{order.customer?.name || order.customer?.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                            <Link
                                                href={order.fileData}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--color-primary)] underline"
                                            >
                                                View File
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap uppercase text-sm text-[var(--color-text-primary)]">{order.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-[var(--color-primary)] hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Suspense>
            </div>
        </div>
    );
}