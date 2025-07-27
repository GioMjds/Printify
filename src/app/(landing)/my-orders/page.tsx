import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { getSession } from "@/lib/auth";
import { fetchCustomerPrintUploads } from "@/services/Customer";
import { AuthRequired } from "@/components/ProtectedRoutes";

const MyOrdersPage = dynamic(() => import("./orders"))

export const metadata = {
    title: "My Orders",
}

interface SearchParams {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    }
}

export default async function MyOrders({ searchParams }: SearchParams) {
    const session = await getSession();
    const queryClient: QueryClient = new QueryClient();

    const resolvedSearchParams = typeof searchParams?.then === "function"
        ? await searchParams
        : searchParams;

    const userId: string = session?.userId as string;
    const page: number = Number(resolvedSearchParams?.page ?? 1);
    const limit: number = Number(resolvedSearchParams?.limit ?? 6);

    try {
        await queryClient.prefetchQuery({
            queryKey: ['myOrders', userId, page, limit],
            queryFn: () => fetchCustomerPrintUploads({ 
                userId: session?.userId as string, 
                page: page, 
                limit: limit
            }),
        });
    } catch (error) {
        console.error(`Failed to prefetch orders for user ${userId}:`, error);
        throw error;
    }

    return (
        <AuthRequired>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <MyOrdersPage userId={userId} page={page} limit={limit} />
            </HydrationBoundary>
        </AuthRequired>
    )
}