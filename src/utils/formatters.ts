import {
    Package,
    Zap,
    Home,
    Users,
    Wrench,
    Megaphone,
    Truck,
    Monitor,
    Briefcase,
    Printer,
    Plane,
    GraduationCap,
    Shield,
    FileText,
    Tag,
} from "lucide-react";

/**
 * @param status - The status string for which to retrieve the color classes.
 * @returns A string containing Tailwind CSS classes for background, text, and border colors
 *          that visually represent the provided status.
 */
export const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "ready_to_pickup":
            return "bg-purple-100 text-purple-800 border-purple-300";
        case "completed":
            return "bg-green-100 text-green-800 border-green-300";
        case "cancelled":
            return "bg-red-100 text-red-800 border-red-300";
        case "rejected":
            return "bg-red-100 text-red-800 border-red-300";
        default:
            return "bg-blue-100 text-blue-800 border-blue-300";
    }
};

/**
 * Formats a date string into a more readable format.
 * @param dateStr - The date string to format.
 * @returns A formatted date string.
 */
export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Get the text color class for a print order status (admin-side).
 * @param status - The status of the print order.
 * @returns A string containing the Tailwind CSS text color class.
 */
export const getPrintOrderStatus = (status: string) => {
    switch (status) {
        case "pending":
            return "text-yellow-500";
        case "ready_to_pickup":
            return "text-purple-500";
        case "completed":
            return "text-green-500";
        case "cancelled":
            return "text-red-500";
        case "rejected":
            return "text-red-500";
        default:
            return "text-gray-500";
    }
}

/**
 * Get the status text for a print order.
 * @param status - The status of the print order.
 * @returns A string representing the status text.
 */
export const getStatus = (status: string) => {
    switch (status) {
        case "pending":
            return "Pending";
        case "printing":
            return "Printing";
        case "ready_to_pickup":
            return "Ready To Pickup";
        case "completed":
            return "Completed";
        case "cancelled":
            return "Cancelled";
        case "rejected":
            return "Rejected";
        default:
            return "Unknown Status";
    }
}

/**
 * Splits a full name into first, middle, and last names.
 * @param name - The full name to split.
 * @returns An object containing firstName, middleName, and lastName.
 */
export const splitName = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return { firstName: parts[0], middleName: "", lastName: "" };
    }
    if (parts.length === 2) {
        return { firstName: parts[0], middleName: "", lastName: parts[1] };
    }
    return {
        firstName: parts[0],
        middleName: parts[1],
        lastName: parts.slice(2).join(" "),
    };
}

/**
 * Formats expense categories with icons and colors.
 * @param category - The category of the expense.
 * @returns An object containing label, icon, and color classes for the category.
 */
export const formatExpenseCategories = (category: string) => {
    switch (category) {
        case "Supplies":
            return { label: "Supplies", icon: Package, color: "bg-yellow-200 text-yellow-800" };
        case "Utilities":
            return { label: "Utilities", icon: Zap, color: "bg-blue-200 text-blue-800" };
        case "Rent":
            return { label: "Rent", icon: Home, color: "bg-purple-200 text-purple-800" };
        case "Salaries & Wages":
            return { label: "Salaries & Wages", icon: Users, color: "bg-green-200 text-green-800" };
        case "Maintenance & Repairs":
            return { label: "Maintenance & Repairs", icon: Wrench, color: "bg-orange-200 text-orange-800" };
        case "Marketing & Advertising":
            return { label: "Marketing & Advertising", icon: Megaphone, color: "bg-pink-200 text-pink-800" };
        case "Shipping & Delivery":
            return { label: "Shipping & Delivery", icon: Truck, color: "bg-indigo-200 text-indigo-800" };
        case "Software & Subscriptions":
            return { label: "Software & Subscriptions", icon: Monitor, color: "bg-cyan-200 text-cyan-800" };
        case "Office Equipment":
            return { label: "Office Equipment", icon: Briefcase, color: "bg-teal-200 text-teal-800" };
        case "Printing Costs":
            return { label: "Printing Costs", icon: Printer, color: "bg-red-200 text-red-800" };
        case "Travel & Transportation":
            return { label: "Travel & Transportation", icon: Plane, color: "bg-lime-200 text-lime-800" };
        case "Training & Development":
            return { label: "Training & Development", icon: GraduationCap, color: "bg-fuchsia-200 text-fuchsia-800" };
        case "Insurance":
            return { label: "Insurance", icon: Shield, color: "bg-gray-200 text-gray-800" };
        case "Taxes & Licenses":
            return { label: "Taxes & Licenses", icon: FileText, color: "bg-amber-200 text-amber-800" };
        case "Miscellaneous":
            return { label: "Miscellaneous", icon: Tag, color: "bg-slate-200 text-slate-800" };
        default:
            return { label: category, icon: Tag, color: "bg-slate-200 text-slate-800" };
    }
};