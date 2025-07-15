import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query"
import dynamic from "next/dynamic";
import { fetchAllPrintOrders } from "@/services/Admin";

const Orders = dynamic(() => import("./orders"))

export const metadata = {
    title: "Orders",
}

export default async function AdminOrders() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['printOrders'],
        queryFn: () => fetchAllPrintOrders()
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Orders />
        </HydrationBoundary>
    );
}