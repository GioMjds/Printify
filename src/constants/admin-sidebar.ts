import {
    BarChart2,
    ClipboardList,
    Gauge,
    LucideIcon,
    Users,
} from "lucide-react";

interface AdminSidebar {
    name: string;
    icon: LucideIcon;
    href: string;
}

export const adminSidebar: AdminSidebar[] = [
    {
        name: "Dashboard",
        icon: Gauge,
        href: "/admin",
    },
    {
        name: "Orders",
        icon: ClipboardList,
        href: "/admin/orders",
    },
    {
        name: "Users",
        icon: Users,
        href: "/admin/users",
    },
    {
        name: "Analytics",
        icon: BarChart2,
        href: "/admin/analytics",
    },
];
