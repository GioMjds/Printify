import { use } from "react";
import { fetchStaff } from "@/services/Admin";
import { User } from "@/types/Admin";

async function showStaff() {
    const response = await fetchStaff();
    return response.staff;
}

export default function StaffPage() {
    const staff = use(showStaff());

    return (
        <div className="overflow-x-auto rounded-lg shadow-md border border-border-light">
            <table className="min-w-full divide-y divide-border-light table-fixed">
                <thead className="bg-bg-soft">
                    <tr>
                        <th className="px-6 py-3 uppercase text-left text-xs font-medium text-text tracking-wider">Name</th>
                        <th className="px-6 py-3 uppercase text-left text-xs font-medium text-text tracking-wider">Email</th>
                        <th className="px-6 py-3 uppercase text-left text-xs font-medium text-text tracking-wider">Role</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                    {staff.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="text-center py-6 text-text-light">No staff members found.</td>
                        </tr>
                    ) : (
                        staff.map((staff: User) => (
                            <tr key={staff.id}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-text">{staff.name}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-text">{staff.email}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-text capitalize">{staff.role}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}