import { getSession } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import { ReactNode } from "react";

/**
 * Protects a route by requiring a valid session. Redirects to /login if not authenticated.
 */
export async function AuthRequired({ children }: { children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");
    return <>{children}</>;
}

/**
 * Redirects authenticated users away from auth pages (e.g., login/register) to their dashboard.
 */
export async function AuthRedirect({ children }: { children: ReactNode }) {
    const session = await getSession();
    if (session) {
        if (session.role === "admin") redirect("/admin", RedirectType.replace);
        else if (session.role === "staff") redirect("/admin", RedirectType.replace);
        else redirect("/", RedirectType.replace);
    }
    return <>{children}</>;
}

/**
 * Restricts access to users with allowed roles. Redirects to the appropriate dashboard or /login if not allowed.
 */
export async function RoleRequired({ allowedRoles, children }: { allowedRoles: string[], children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");

    if (session.role === "staff" && typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/admin") && path !== "/admin/orders" && !path.startsWith("/admin/orders")) {
            redirect("/admin/orders", RedirectType.replace);
        }
    }

    if (!allowedRoles.includes(session.role)) {
        if (session.role === "admin") redirect("/admin", RedirectType.replace);
        if (session.role === "staff") redirect('/admin/orders', RedirectType.replace);
        if (session.role === "customer") redirect("/", RedirectType.replace);
        redirect("/", RedirectType.replace);
    }
    return <>{children}</>;
}

/**
 * Restricts access to the registration verification phase. Only allows access if 'register_email' exists in localStorage.
 * Redirects to /login otherwise. (Client-side only)
 */
export async function RegisterPhaseRequired({ children }: { children: ReactNode }) {
    if (typeof window === "undefined") redirect("/login", RedirectType.replace);
    if (!localStorage.getItem("register_email")) redirect("/login", RedirectType.replace);
    return <>{children}</>;
}