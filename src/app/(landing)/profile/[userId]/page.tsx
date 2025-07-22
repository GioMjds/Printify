import { fetchCustomerProfile } from "@/services/Customer";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const ProfilePage = dynamic(() => import("./profile"))

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await params;
        const data = await fetchCustomerProfile({ userId: userId });

        if (!data || data.error) {
            return {
                title: "Profile Not Found"
            };
        }

        return {
            title: data.name ? `${data.name} | Profile` : "User Profile",
            description: `Profile details for ${data.name || "the user"}`,
        }
    } catch {
        return {
            title: "Profile Not Found"
        }
    }
}

export default async function Profile(context: { params: Promise<{ userId: string }> }) {
    const { userId } = await context.params;
    const queryClient = new QueryClient();

    try {
        const data = await queryClient.fetchQuery({
            queryKey: ['profile', userId],
            queryFn: () => fetchCustomerProfile({ userId })
        });
        if (!data || data.error) notFound();
    } catch (error) {
        notFound();
    }


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfilePage userId={userId} />
        </HydrationBoundary>
    )
}