import MyOrdersPage from "./orders"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import { fetchCustomerPrintUploads } from "@/services/Customer";
import { AuthRequired } from "@/components/ProtectedRoutes";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "My Orders",
}

export default async function MyOrders() {
    const session = await getSession();
    const queryClient = new QueryClient();

    const userId = session?.userId as string;
    const page: number = 1;
    const limit: number = 6;

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
                <MyOrdersPage userId={userId} />
            </HydrationBoundary>
        </AuthRequired>
    )
}