'use client';

import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const pulseVariants = {
    pulse: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                className="flex items-center justify-center h-screen px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="text-center relative z-10 max-w-2xl">
                    <motion.div
                        variants={pulseVariants}
                        animate="pulse"
                        className="mb-8"
                    >
                        <div className="text-[120px] md:text-[180px] font-bold text-highlight leading-none">
                            404
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-highlight mb-4"
                        variants={itemVariants}
                    >
                        User Not Found
                    </motion.h1>

                    <motion.p
                        className="text-xl text-highlight/80 mb-8"
                        variants={itemVariants}
                    >
                        The user you&apos;re looking for doesn&apos;t exist or has been removed.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-secondary text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Go To Homepage
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}