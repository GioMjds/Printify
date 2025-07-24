import { Metadata } from "next"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query"
import StaffPage from "./staff"
import { fetchStaff } from "@/services/Admin"
import AddStaffButton from "@/components/admin/AddStaffButton"

export const metadata: Metadata = {
    title: "Manage Staff",
}

export default async function Staff() {
    const queryClient = new QueryClient()

    try {
        await queryClient.prefetchQuery({
            queryKey: ['adminStaff'],
            queryFn: () => fetchStaff(),
        });
    } catch (error) {
        console.error(`Failed to prefetch staff data: ${error}`);
        throw error;
    }

    return (
        <HydrationBoundary state={dehydrate(new QueryClient())}>
            <div className="min-h-screen bg-white p-8">
                <AddStaffButton />
                <StaffPage />
            </div>
        </HydrationBoundary>
    )
}