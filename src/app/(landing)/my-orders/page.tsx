import MyOrdersPage from "./orders"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import { fetchCustomerPrintUploads } from "@/services/Customer";

export const metadata = {
    title: "My Orders",
}

export default async function MyOrders(context: { params: Promise<{ userId: string }> }) {
    const { userId } = await context.params;
    const session = await getSession();
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['myOrders', userId],
        queryFn: () => fetchCustomerPrintUploads({ userId: session?.userId as string }), // Replace with actual userId if needed
    });
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MyOrdersPage userId={userId} />
        </HydrationBoundary>
    )
}