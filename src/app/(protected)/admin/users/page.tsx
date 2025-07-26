import { Metadata } from "next";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { fetchUsers } from "@/services/Admin";
import AdminUsers from "./users";

export const dynamic = 'force-dynamic';

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
            <div className="min-h-screen bg-white p-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Manage Users</h1>
                    <p className="text-text-light">View and manage all registered users in the system.</p>
                </div>
                <AdminUsers />
            </div>
        </HydrationBoundary>
    );
}