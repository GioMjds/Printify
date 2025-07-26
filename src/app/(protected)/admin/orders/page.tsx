import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query"
import { fetchAllPrintOrders } from "@/services/Admin";
import OrderDataTable from "@/components/admin/OrderDataTable";
import { PrintOrder } from "@/types/Admin";

export const metadata = {
    title: "Manage Orders",
}

export const dynamic = 'force-dynamic';

export default async function AdminOrders() {
    const queryClient = new QueryClient();
    
    try {
        await queryClient.prefetchQuery({
            queryKey: ['printOrders'],
            queryFn: fetchAllPrintOrders
        });
    } catch (error) {
        console.error(`Failed to prefetch orders: ${error}`);
        throw error;
    }

    const initialData = queryClient.getQueryData
    <{ printOrders: PrintOrder[] }>(['printOrders'])?.printOrders;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-white p-4">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-primary mb-2">Customer Orders</h1>
                    <p className="text-text-light">Manage and review all print orders submitted by customers.</p>
                </div>
                <OrderDataTable initialData={initialData ?? []} />
            </div>
        </HydrationBoundary>
    );
}