import { fetchCustomerProfile } from "@/services/Customer";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { getSession } from "@/lib/auth";

const ProfilePage = dynamic(() => import("./profile"))

export const metadata = {
    title: "My Profile",
}

export default async function Profile(context: { params: Promise<{ userId: string }> }) {
    const { userId } = await context.params;
    const session = await getSession();
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['profile', userId],
        queryFn: () => fetchCustomerProfile({ userId: session?.userId as string })
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfilePage userId={userId} />
        </HydrationBoundary>
    )
}