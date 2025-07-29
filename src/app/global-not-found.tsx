import { Metadata } from "next"
import Link from "next/link"
import { Lexend } from "next/font/google"
import Image from "next/image"
import NotFound from "../../public/not-found.png"
import './globals.css'

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Page Not Found | Printify",
    description: "The page you are looking for does not exist.",
}

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body className={`${lexend.variable} antialiased`}>
                <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    {/* Floating particles */}
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                                background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}

                    {/* Main content */}
                    <div className="glass-card p-8 sm:p-10 max-w-2xl w-full z-50 backdrop-blur-sm border border-white/20 overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -inset-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 animate-shimmer"></div>
                        </div>

                        <div className="relative z-10 text-center space-y-8">
                            {/* 404 text with glow */}
                            <div className="relative">
                                <h1 className="text-4xl sm:text-6xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-highlight to-secondary mb-4">
                                    404 Not Found
                                </h1>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-20 blur-xl rounded-full -z-10"></div>
                            </div>

                            {/* Image with floating effect */}
                            <div className="relative h-48 w-48 mx-auto animate-float">
                                <Image
                                    src={NotFound}
                                    alt="Lost in space illustration"
                                    fill
                                    className="object-contain drop-shadow-lg"
                                />
                                <div className="absolute inset-0 rounded-full bg-accent opacity-10 blur-md -z-10"></div>
                            </div>

                            {/* Message */}
                            <div className="space-y-4">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                    Oops! You&apos;ve Found a Digital Void
                                </h2>
                                <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto">
                                    The page you&apos;re seeking has vanished into the digital ether.
                                    But don&apos;t worry - we&apos;ll help you navigate back to familiar territory.
                                </p>
                            </div>

                            {/* Action button with pulse animation */}
                            <div>
                                <Link
                                    href="/"
                                    className="inline-flex cursor-pointer z-50 items-center px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-accent to-secondary text-white font-medium rounded-lg group overflow-hidden"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-8 text-center max-w-lg">
                        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-accent to-secondary opacity-20 blur-sm"></div>
                        <p className="text-white/60 text-xs sm:text-sm px-4 py-2 bg-white/5 rounded-lg backdrop-blur-sm">
                            Need help? Our support team is standing by to assist you.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    )
}