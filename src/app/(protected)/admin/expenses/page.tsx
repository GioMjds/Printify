import { Metadata } from "next"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { fetchExpenses } from "@/services/Admin";
import ExpensesPage from "./expenses";

export const metadata: Metadata = {
    title: "Manage Expenses",
}

export const dynamic = 'force-dynamic';

export default async function Expenses() {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: ['expenses'],
            queryFn: fetchExpenses
        });
    } catch (error) {
        console.error(`Failed to prefetch expenses: ${error}`);
        throw error;
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-white p-4">
                <ExpensesPage />
            </div>
        </HydrationBoundary>
    )
}