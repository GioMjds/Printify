export const metadata = {
    title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-8 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between py-4 px-6 bg-white rounded-xl shadow-md border border-border-light">
                <h1 className="text-2xl font-bold text-primary">Welcome, Admin</h1>
                <span className="text-base text-text-light">Dashboard Overview</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-start bg-gradient-to-br from-primary to-accent text-white rounded-xl p-6 shadow-lg">
                    <span className="text-lg font-semibold">Total Orders</span>
                    <span className="text-3xl font-bold mt-2">1,245</span>
                </div>
                <div className="flex flex-col items-start bg-gradient-to-br from-secondary to-accent text-white rounded-xl p-6 shadow-lg">
                    <span className="text-lg font-semibold">Active Users</span>
                    <span className="text-3xl font-bold mt-2">320</span>
                </div>
                <div className="flex flex-col items-start bg-gradient-to-br from-accent to-highlight text-primary rounded-xl p-6 shadow-lg">
                    <span className="text-lg font-semibold">Revenue</span>
                    <span className="text-3xl font-bold mt-2">$12,500</span>
                </div>
                <div className="flex flex-col items-start bg-gradient-to-br from-highlight to-secondary text-primary rounded-xl p-6 shadow-lg">
                    <span className="text-lg font-semibold">Pending Orders</span>
                    <span className="text-3xl font-bold mt-2">18</span>
                </div>
            </div>

            {/* Analytics */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-white rounded-xl shadow-md p-6 border border-border-light">
                    <h2 className="text-xl font-semibold mb-4 text-primary">Analytics</h2>
                    <div className="h-48 flex items-center justify-center text-text-light">[Analytics Chart Placeholder]</div>
                </div>
            </div>
        </div>
    );
}