import { Metadata } from "next";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { fetchAdminDashboardDetails } from "@/services/Admin";
import Header from "@/layout/admin/Header";
import SummaryCards from "@/components/admin/SummaryCards";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
    searchParams
}: {
    searchParams: Promise<{ month?: string; year?: string; }>
}) {
    const queryClient = new QueryClient();
    const resolvedSearchParams = await searchParams;
    const month = resolvedSearchParams?.month ? parseInt(resolvedSearchParams.month) : new Date().getMonth() + 1;
    const year = resolvedSearchParams?.year ? parseInt(resolvedSearchParams.year) : new Date().getFullYear();
    
    try {
        await queryClient.prefetchQuery({
            queryKey: ['adminDashboard', month, year],
            queryFn: () => fetchAdminDashboardDetails({ month, year }),
        });
    } catch (error) {
        console.error(`Failed to prefetch admin dashboard details: ${error}`);
        throw error;
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Header month={month} year={year} />
            <SummaryCards month={month} year={year} />
        </HydrationBoundary>
    );
}