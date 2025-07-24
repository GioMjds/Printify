import { use } from "react";
import { fetchAdminDashboardDetails } from "@/services/Admin";

async function fetchSummaryCards(month: number, year: number) {
    const response = await fetchAdminDashboardDetails({ month, year });
    return response;
}

export default function SummaryCards({
    month, year,
}: {
    month: number;
    year: number;
}) {
    const data = use(fetchSummaryCards(month, year));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <div className="flex flex-col items-start bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 shadow-lg">
                <span className="text-lg font-semibold">Total Orders</span>
                <span className="text-3xl font-bold mt-2">
                    {data?.totalOrders}
                </span>
            </div>
            <div className="flex flex-col items-start bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 shadow-lg">
                <span className="text-lg font-semibold">Completed Orders</span>
                <span className="text-3xl font-bold mt-2">
                    {data?.uploadsByStatus?.find((u: { status: string }) => u.status === "completed")?._count?.status || 0}
                </span>
            </div>
            <div className="flex flex-col items-start bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 shadow-lg">
                <span className="text-lg font-semibold">Revenue</span>
                <span className="text-3xl font-bold mt-2">₱{data?.totalRevenue || 0}</span>
            </div>
            <div className="flex flex-col items-start bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 shadow-lg">
                <span className="text-lg font-semibold">Pending Orders</span>
                <span className="text-3xl font-bold mt-2">
                    {data?.uploadsByStatus?.find((u: { status: string }) => u.status === "pending")?._count?.status || 0}
                </span>
            </div>
        </div>
    );
}