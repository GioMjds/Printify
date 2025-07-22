import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query"
import dynamic from "next/dynamic";
import { fetchAllPrintOrders } from "@/services/Admin";

const OrderDataTable = dynamic(() => import("@/components/admin/OrderDataTable"));

export const metadata = {
    title: "Orders",
}

export default async function AdminOrders() {
    const queryClient = new QueryClient();
    try {
        await queryClient.prefetchQuery({
            queryKey: ['printOrders'],
            queryFn: () => fetchAllPrintOrders()
        });
    } catch (error) {
        console.error(`Failed to prefetch orders: ${error}`);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-white p-4">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-primary mb-2">Customer Orders</h1>
                    <p className="text-text-light">Manage and review all print orders submitted by customers.</p>
                </div>
                <OrderDataTable />
            </div>
        </HydrationBoundary>
    );
}