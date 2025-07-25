'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchAllPrintOrders } from "@/services/Admin";
import { PrintOrder } from "@/types/Admin";
import { getPrintOrderStatus, getStatus } from "@/utils/formatters";
import OrderActions from "./AdminOrderActions";

export default function OrderDataTable({ initialData }: { initialData?: PrintOrder[] }) {
    const { data } = useQuery({
        queryKey: ['printOrders'],
        queryFn: fetchAllPrintOrders,
        initialData,
    });

    const printOrders = data.printOrders || [];

    return (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
            <table className="min-w-full divide-y divide-border-light table-fixed">
                <thead className="bg-bg-soft">
                    <tr>
                        {['Customer', 'File', 'Status', 'Date', 'Actions'].map((header) => (
                            <th key={header} className="px-6 py-3 text-center text-sm font-semibold text-primary uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                    {printOrders.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-lg text-gray-500">
                                No print orders yet.
                            </td>
                        </tr>
                    ) : (
                        printOrders.map((order: PrintOrder) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-primary">{order.customer?.name}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-primary">
                                    <span>
                                        {order.filename.length > 20
                                            ? `${order.filename.slice(0, 20)}...`
                                            : order.filename}
                                    </span>
                                </td>
                                <td className={`uppercase font-semibold text-center ${getPrintOrderStatus(order.status)}`}>{getStatus(order.status)}</td>
                                <td className="px-6 py-4 text-md text-center text-primary">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 items-center justify-center">
                                    <OrderActions order={order} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}