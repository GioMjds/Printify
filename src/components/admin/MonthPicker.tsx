"use client";

import { useRouter } from "next/navigation";

export function MonthPicker({
    month,
    year,
}: {
    month: number;
    year: number;
}) {
    const router = useRouter();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleMonthChange = (newMonth: number) => {
        const searchParams = new URLSearchParams();
        searchParams.set("month", newMonth.toString());
        searchParams.set("year", year.toString());
        router.push(`/admin?${searchParams.toString()}`);
    };

    const handleYearChange = (newYear: number) => {
        const searchParams = new URLSearchParams();
        searchParams.set("month", month.toString());
        searchParams.set("year", newYear.toString());
        router.push(`/admin?${searchParams.toString()}`);
    };

    return (
        <div className="flex items-center gap-4">
            <select
                className="bg-white border border-border-light rounded-lg px-4 py-2 text-primary"
                value={month}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            >
                {months.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                ))}
            </select>
            <select
                className="bg-white border border-border-light rounded-lg px-4 py-2 text-primary"
                value={year}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
            >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
    );
}