import { use } from "react";
import { fetchAllPrintOrders } from "@/services/Admin";
import { PrintOrder } from "@/types/Admin";
import { getPrintOrderStatus, getStatus } from "@/utils/formatters";
import OrderActions from "./AdminOrderActions";

async function getPrintOrders() {
    try {
        const response = await fetchAllPrintOrders();
        return response.printOrders;
    } catch (error) {
        console.error(`Failed to fetch print orders: ${error}`);
        throw error;
    }
}

export default function OrderDataTable() {
    const printOrders = use(getPrintOrders());

    return (
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