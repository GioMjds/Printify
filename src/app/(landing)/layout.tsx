import Footer from "@/layout/Footer";
import Navbar from "@/layout/Navbar";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "../../app/globals.css";
import Providers from "../providers";
import { getSession, getCurrentUser } from "@/lib/auth";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ToastContainer } from "react-toastify";

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Printify - Your Print on Demand Partner",
    description: "Printify is your go-to platform for print on demand services, offering a wide range of customizable products and seamless integration with e-commerce platforms.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let userDetails: null | object = null;
    const session = await getSession();
    if (session) {
        const user = await getCurrentUser();
        userDetails = {
            profileImage: user?.profile_image ?? undefined,
            name: user?.name ?? undefined,
            email: user?.email ?? undefined,
            role: user?.role?.toString() ?? undefined,
            id: user?.id ?? undefined,
        };
    }

    return (
        <html lang="en">
            <body className={`${lexend.variable} antialiased`}>
                <WebSocketProvider>
                    <Providers>
                        <Navbar userDetails={userDetails} />
                        <main className="flex-1 flex flex-col w-full">
                            {children}
                        </main>
                        <Footer />
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
                    </Providers>
                </WebSocketProvider>
            </body>
        </html>
    );
}
