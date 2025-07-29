import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import { fetchCustomerPrintUploads } from "@/services/Customer";
import { AuthRequired } from "@/components/ProtectedRoutes";
import { Metadata } from "next";
import MyOrdersPage from "./orders";

export const metadata: Metadata = {
    title: "My Orders",
}

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function MyOrders({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams
    
    const session = await getSession();
    const queryClient: QueryClient = new QueryClient();

    const userId: string = session?.userId as string;
    const page: number = Number(resolvedSearchParams?.page ?? 1);
    const limit: number = Number(resolvedSearchParams?.limit ?? 6);

    await queryClient.prefetchQuery({
        queryKey: ['myOrders', userId, page, limit],
        queryFn: () => fetchCustomerPrintUploads({
            userId: session?.userId as string,
            page: page,
            limit: limit
        }),
    });

    return (
        <AuthRequired>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <MyOrdersPage userId={userId} page={page} limit={limit} />
            </HydrationBoundary>
        </AuthRequired>
    )
}