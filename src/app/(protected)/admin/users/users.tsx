import { use } from "react";
import { fetchUsers } from "@/services/Admin";
import { User } from "@/types/Admin";
import { CheckCircle } from "lucide-react";

async function showUsers() {
    const response = await fetchUsers();
    return response.users;
}

export default function AdminUsers() {
    const users = use(showUsers());

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Manage Users</h1>
                <p className="text-text-light">View and manage all registered users in the system.</p>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full divide-y divide-border-light table-fixed">
                    <thead className="bg-bg-soft">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border-light">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-text-light">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user: User) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text flex items-center gap-2">
                                        {user.name}
                                        {user.isVerified && (
                                            <CheckCircle className="text-green-500 w-4 h-4" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text capitalize">{user.role}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}