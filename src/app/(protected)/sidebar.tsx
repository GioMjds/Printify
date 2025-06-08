'use client';

import { adminSidebar } from "@/constants/admin-sidebar";
import { customerSidebar } from "@/constants/customer-sidebar";
import { logout } from "@/services/Auth";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ role }: { role: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = role === 'admin' ? adminSidebar : customerSidebar;

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error(`Error logging out: ${error}`);
        }
    };

    return (
        <aside className="h-screen w-64 bg-gradient-to-b from-primary to-secondary text-white flex flex-col justify-between shadow-xl">
            <nav className="flex-1 px-6 py-8">
                <div className="mb-10 flex items-center gap-3">
                    <Image src="/printify_logo.png" alt="Printify Logo" width={40} height={40} priority />
                    <span className="text-2xl font-bold tracking-wide">Printify</span>
                </div>
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors font-medium ${isActive
                                        ? "bg-accent text-highlight shadow-md"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-highlight" : "text-white"}`} />
                                    <span className="text-base">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="px-6 pb-8">
                <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer py-2 rounded-lg bg-accent text-white font-semibold hover:bg-highlight hover:text-primary transition-colors shadow-md"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Log Out
                </button>
            </div>
        </aside>
    );
}