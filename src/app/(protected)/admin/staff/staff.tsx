'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "@/services/Admin";
import { User } from "@/types/Admin";
import StaffActions from "@/components/admin/StaffActions";

export default function StaffPage() {
    const { data } = useQuery({
        queryKey: ['adminStaff'],
        queryFn: fetchStaff,
        select: (data) => data.staff || [],
    });

    const staff = data || [];

    return (
        <div className="overflow-x-auto rounded-lg shadow-md border border-border-light">
            <table className="min-w-full divide-y divide-border-light table-fixed">
                <thead className="bg-bg-soft">
                    <tr>
                        {['Name', 'Email', 'Actions'].map((header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
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
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                    <StaffActions staff={staff} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}