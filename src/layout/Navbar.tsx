'use client';

import { navbar } from '@/constants/navbar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const itemVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 },
        },
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
        open: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-primary shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-16 lg:h-20 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <motion.div
                    className="flex-shrink-0"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                            <Image
                                src="/printify_logo.png"
                                alt="Printify Logo"
                                fill
                                sizes='auto'
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl lg:text-2xl font-bold text-highlight drop-shadow-md">
                            Printify
                        </span>
                    </Link>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="hidden lg:flex items-center space-x-4"
                    variants={itemVariants}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/login"
                            className="text-base font-medium nav-link px-4 py-2 text-highlight hover:text-bg-white hover:bg-accent rounded-full transition-colors duration-200"
                        >
                            Login
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/register"
                            className="btn-primary bg-highlight text-primary hover:bg-accent hover:text-bg-white rounded-full px-6 py-2 font-bold shadow-md transition-colors duration-200"
                        >
                            Register
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Mobile menu button */}
                <motion.div
                    className="lg:hidden"
                    variants={itemVariants}
                >
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        whileTap={{ scale: 0.95 }}
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <motion.div
                            animate={isOpen ? "open" : "closed"}
                            className="w-6 h-6 flex flex-col justify-center items-center"
                        >
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: 45, y: 6 }
                                }}
                                className="w-5 h-0.5 bg-current block transition-all duration-300"
                            />
                            <motion.span
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 }
                                }}
                                className="w-5 h-0.5 bg-current block mt-1 transition-all duration-300"
                            />
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: -45, y: -6 }
                                }}
                                className="w-5 h-0.5 bg-current block mt-1 transition-all duration-300"
                            />
                        </motion.div>
                    </motion.button>
                </motion.div>
            </div>

            {/* Mobile Navigation Menu */}
            <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className="lg:hidden overflow-hidden bg-accent rounded-lg mt-2 shadow-soft"
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <div className="pt-4 pb-2 border-t border-highlight">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={isOpen ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                            transition={{ delay: navbar.length * 0.1 }}
                            className="space-y-2"
                        >
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium nav-link text-highlight hover:text-primary hover:bg-bg-white transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block px-3 py-2 rounded-md text-base font-medium nav-link bg-highlight text-primary hover:bg-accent hover:text-bg-white transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Register
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </nav>
    );
}