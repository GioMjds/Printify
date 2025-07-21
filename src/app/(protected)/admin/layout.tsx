import "@/app/globals.css";
import Providers from "@/app/providers";
import { RoleRequired } from "@/components/ProtectedRoutes";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Sidebar from "../sidebar";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${lexend.variable} antialiased`}>
                <WebSocketProvider>
                    <Providers>
                        <RoleRequired allowedRoles={['admin']}>
                            <div className="flex min-h-screen">
                                <div className="sticky top-0 h-screen flex-shrink-0 z-30">
                                    <Sidebar />
                                </div>
                                <main className="flex-1 flex flex-col overflow-y-auto min-h-screen p-4">
                                    {children}
                                </main>
                            </div>
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                theme="light"
                                toastClassName="font-lexend"
                            />
                        </RoleRequired>
                    </Providers>
                </WebSocketProvider>
            </body>
        </html>
    );
}
