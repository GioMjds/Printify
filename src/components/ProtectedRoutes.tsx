import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
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
    if (session && session.role === 'admin') redirect('/admin');
    if (session && session.role === 'customer') redirect('/');
    return <>{children}</>;
}

/**
 * Restricts access to users with allowed roles. Redirects to the appropriate dashboard or /login if not allowed.
 */
export async function RoleRequired({ allowedRoles, children }: { allowedRoles: string[], children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");
    if (!allowedRoles.includes(session.role)) {
        if (session.role === "admin") redirect("/admin");
        if (session.role === "customer") redirect("/");
        redirect("/login");
    }
    return <>{children}</>;
}

/**
 * Restricts access to the registration verification phase. Only allows access if 'register_email' exists in localStorage.
 * Redirects to /login otherwise. (Client-side only)
 */
export async function RegisterPhaseRequired({ children }: { children: ReactNode }) {
    if (typeof window === "undefined") redirect("/login");
    if (!localStorage.getItem("register_email")) redirect("/login");
    return <>{children}</>;
}