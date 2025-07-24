import { Metadata } from "next";
import { 
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { fetchUsers } from "@/services/Admin";

const AdminUsers = dynamic(() => import("./users"));

export const metadata: Metadata = {
    title: "Manage Users",
}

export default async function UsersPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['adminUsers'],
        queryFn: fetchUsers,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminUsers />
        </HydrationBoundary>
    );
}