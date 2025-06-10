"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function RegisterPhaseRequired({ children }: { children: ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("register_email")) {
            router.replace("/login");
        }
    }, []);

    if (typeof window !== "undefined" && localStorage.getItem("register_email")) {
        return <>{children}</>;
    }

    return null;
}