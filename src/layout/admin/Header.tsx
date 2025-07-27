"use client";

import { useState } from "react";
import { isAfter, isSameDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function Header({
    month, year
}: {
    month: number;
    year: number;
}) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const today = new Date();

    const router = useRouter();

    const handleDateChange = (date: Date | null) => {
        if (!date || isAfter(date, today) && !isSameDay(date, today)) return;
        setSelectedDate(date);
        router.push(`/admin?month=${date.getMonth() + 1}&year=${date.getFullYear()}`);
    }

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-6 bg-white rounded-xl shadow-md border border-border-light">
            <div>
                <h1 className="text-2xl font-bold text-primary">
                    Welcome, Admin
                </h1>
                <span className="text-base text-text-light">
                    Dashboard Overview - {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
            </div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                maxDate={today}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="bg-white border border-border-light rounded-lg px-4 py-2 text-primary font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-bg-accent"
                calendarClassName="!z-50"
                popperPlacement="bottom-start"
            />
        </div>
    );
}