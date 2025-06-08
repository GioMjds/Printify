import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";


export async function AuthRequired({ children }: { children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");
    return <>{children}</>;
}

export async function AuthRedirect({ children }: { children: ReactNode }) {
    const session = await getSession();
    if (session) redirect(session.role === "admin" ? "/admin" : "/customer");
    return <>{children}</>;
}

export async function AdminRequired({ children }: { children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");
    if (session.role !== "admin") redirect("/customer");
    return <>{children}</>;
}

export async function CustomerRequired({ children }: { children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");
    if (session.role !== "customer") redirect("/admin");
    return <>{children}</>;
}

export async function RoleRequired({ allowedRoles, children }: { allowedRoles: string[], children: ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/login");
    if (!allowedRoles.includes(session.role)) {
        if (session.role === "admin") redirect("/admin");
        if (session.role === "customer") redirect("/customer");
        redirect("/login");
    }
    return <>{children}</>;
}