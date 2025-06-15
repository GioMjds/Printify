import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import FetchSingleOrder from "./fetch-single-order";
import { fetchPrintOrder } from "@/services/Admin";

export const metadata = {
    title: "Order Details",
}

export default async function OrderDetails(context: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await context.params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['printOrder', orderId],
        queryFn: () => fetchPrintOrder({ uploadId: orderId })
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FetchSingleOrder orderId={orderId} />
        </HydrationBoundary>
    )
}