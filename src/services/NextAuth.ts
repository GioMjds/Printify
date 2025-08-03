"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const login = async () => {
        await signIn("google", { callbackUrl: "/" });
    };

    const logout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return {
        user: session?.user,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        login,
        logout,
    };
};
