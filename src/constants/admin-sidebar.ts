import {
    BadgePercent,
    ClipboardList,
    Gauge,
    LucideIcon,
    Users,
    UserCog
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
        name: "Sales",
        icon: BadgePercent,
        href: "/admin/sales",
    },
    {
        name: "Manage Orders",
        icon: ClipboardList,
        href: "/admin/orders",
    },
    {
        name: "Manage Staff",
        icon: UserCog,
        href: "/admin/staff",
    },
    {
        name: "Manage Users",
        icon: Users,
        href: "/admin/users",
    },
];
