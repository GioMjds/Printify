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
export function formatDate(dateStr: string) {
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
export function getPrintOrderStatus(status: string) {
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

export function getStatus(status: string) {
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