"use client";

import { MonthPicker } from "../../components/admin/MonthPicker";

export default function Header({
    month, year,
}: {
    month: number;
    year: number;
}) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-6 bg-white rounded-xl shadow-md border border-border-light">
            <div>
                <span className="text-base text-text-light">
                    Dashboard Overview - {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
            </div>
            <MonthPicker month={month} year={year} />
        </div>
    );
}