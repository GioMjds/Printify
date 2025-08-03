'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminSidebar } from "@/constants/admin-sidebar";
import { logout } from "@/services/Auth";
import { LogOut } from "lucide-react";
import Modal from "@/components/Modal";
import CountBadge from "@/components/admin/CountBadge";
import { useOrderCounts } from "@/hooks/useOrderCounts";

export default function Sidebar({ role }: { role?: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState<boolean>(false);
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

    const { counts, isLoading: countsLoading } = useOrderCounts();

    const sidebarItems = role === "staff"
        ? adminSidebar.filter(item => item.name === "Manage Orders")
        : adminSidebar;

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            router.push("/");
        } catch (error) {
            console.error(`Error logging out: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const renderCountBadge = (itemName: string) => {
        if (itemName === "Manage Orders" && !countsLoading) {
            const tooltip = `${counts.pending} pending, ${counts.readyToPickup} ready to pickup`;
            return (
                <CountBadge
                    count={counts.total}
                    variant={counts.pending > 0 ? "urgent" : "default"}
                    tooltip={tooltip}
                />
            )
        }
        return null;
    }

    return (
        <>
            <aside className="h-screen w-64 bg-gradient-to-b from-primary to-secondary text-white flex flex-col justify-between shadow-xl">
                <nav className="flex-1 px-6 py-8">
                    <div className="mb-10 flex items-center gap-3">
                        <Image src="/printify_logo.png" alt="Printify Logo" width={40} height={40} priority />
                        <span className="text-2xl font-bold tracking-wide">Printify</span>
                    </div>
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => {
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
                                        <div className="flex items-center gap-4 relative">
                                            <item.icon className={`w-5 h-5 ${isActive ? "text-highlight" : "text-white"}`} />
                                            <span className="text-base relative">
                                                {item.name}
                                                {item.name === "Manage Orders" && (
                                                    <span className="absolute -top-4 -right-10">
                                                        {renderCountBadge(item.name)}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="px-6 pb-8">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center justify-center cursor-pointer gap-2 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-highlight hover:text-primary transition-colors shadow-md"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
            {showLogoutModal && (
                <Modal
                    isOpen={showLogoutModal}
                    onCancel={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                    icon={<LogOut className="w-6 h-6" size={24} />}
                    title="Confirm Logout"
                    description="Are you sure you want to log out?"
                    confirmText="Log Out"
                    cancelText="Cancel"
                    loading={loading}
                    loadingText="Logging out..."
                />
            )}
        </>
    );
}