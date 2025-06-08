import { RoleRequired } from "@/components/ProtectedRoutes";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import Sidebar from "./sidebar";

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: {
        default: "Printify - Your Print on Demand Partner",
        template: "%s | Printify",
    },
    description: "Printify is your go-to platform for print on demand services, offering a wide range of customizable products and seamless integration with e-commerce platforms.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();
    const role = session?.role as string;
    
    return (
        <html lang="en">
            <body className={`${lexend.variable} antialiased`}>
                <Providers>
                    <div className="flex min-h-screen">
                        <Sidebar role={role} />
                        <main className="flex-1 container mx-auto p-4">
                            <RoleRequired allowedRoles={['admin', 'customer']}>
                                {children}
                            </RoleRequired>
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
