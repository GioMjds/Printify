"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const handleStorageChange = () => {
            router.refresh();
        };

        if (window.location.search.includes('callbackUrl') ||
            window.location.pathname.includes('/api/auth/callback')) {
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 100);
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [router]);

    return <SessionProvider>{children}</SessionProvider>;
}