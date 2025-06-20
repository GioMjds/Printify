'use client';

import { fetchCustomerProfile } from "@/services/Customer";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Shield, CheckCheckIcon, CheckIcon, CheckCircle2Icon } from "lucide-react";
import { User } from "@/types/prismaTypes";

interface ProfilePageProps {
    userId: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.6
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

const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

export default function ProfilePage({ userId }: ProfilePageProps) {
    const { data } = useQuery<User>({
        queryKey: ["profile", userId],
        queryFn: () => fetchCustomerProfile({ userId: userId }),
        enabled: !!userId,
    });

    if (!data) return null;

    return (
        <motion.div
            className="min-h-screen w-full bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden p-4 mt-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
                {/* Profile Header */}
                <motion.div
                    className="glass-card p-8 mb-8 backdrop-blur-xl"
                    variants={cardVariants}
                >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="relative bg-white p-2 rounded-full">
                                <Image
                                    src={data.profile_image as string}
                                    alt="Profile"
                                    width={160}
                                    height={160}
                                    loading="lazy"
                                    className="rounded-full object-cover ring-4 ring-white/50 shadow-2xl"
                                />
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <motion.div variants={itemVariants}>
                                <h1 className="text-5xl font-bold text-highlight mb-2 flex items-center gap-2">
                                    {data.name}
                                    {data.isVerified && ( <CheckCircle2Icon className="text-green-500 w-10 h-10" />)}
                                </h1>
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-highlight text-xl mb-4">
                                    <Mail className="w-5 h-5" />
                                    <span>{data.email}</span>
                                </div>
                                <div
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-secondary text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider shadow-lg"
                                >
                                    <Shield className="w-4 h-4" />
                                    {data.role}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="hidden lg:block"
                            variants={itemVariants}
                        >
                            <div className="grid grid-cols-1 gap-4 text-center">
                                <div className="glass-card p-4 rounded-xl">
                                    <div className="text-5xl font-bold text-text-primary">{data.uploads?.length}</div>
                                    <div className="text-highlight text-sm">Total Orders</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}