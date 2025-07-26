import { Metadata } from "next"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query"
import StaffPage from "./staff"
import { fetchStaff } from "@/services/Admin"
import AddStaffButton from "@/components/admin/AddStaffButton"
import { User } from "@/types/Admin"

export const metadata: Metadata = {
    title: "Manage Staff",
}

export const dynamic = 'force-dynamic';

export default async function Staff() {
    const queryClient = new QueryClient()

    try {
        await queryClient.prefetchQuery({
            queryKey: ['adminStaff'],
            queryFn: fetchStaff,
        });
    } catch (error) {
        console.error(`Failed to prefetch staff data: ${error}`);
        throw error;
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-white p-4">
                <AddStaffButton />
                <StaffPage />
            </div>
        </HydrationBoundary>
    )
}