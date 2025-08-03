import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { AuthRedirect } from "@/components/ProtectedRoutes";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import NextAuthProvider from "../providers/NextAuthProviders";

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: {
        default: "Printify - Your Print on Demand Partner",
        template: "%s - Printify",
    },
    description: "Printify is your go-to platform for print on demand services, offering a wide range of customizable products and seamless integration with e-commerce platforms.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${lexend.variable} antialiased`}>
                <WebSocketProvider>
                    <NextAuthProvider>
                        <Providers>
                            <AuthRedirect>
                                {children}
                            </AuthRedirect>
                        </Providers>
                    </NextAuthProvider>
                </WebSocketProvider>
            </body>
        </html>
    );
}
