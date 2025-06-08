import {
    Gauge,
    UserCircle,
    ShoppingCart,
    ListChecks,
    LucideIcon,
} from "lucide-react";

interface CustomerSidebar {
    name: string;
    icon: LucideIcon;
    href: string;
}
export const customerSidebar: CustomerSidebar[] = [
    {
        name: "Dashboard",
        icon: Gauge,
        href: "/customer",
    },
    {
        name: "Profile",
        icon: UserCircle,
        href: "/customer/profile",
    },
    {
        name: "New Order",
        icon: ShoppingCart,
        href: "/customer/new",
    },
    {
        name: "My Orders",
        icon: ListChecks,
        href: "/customer/orders",
    }
]