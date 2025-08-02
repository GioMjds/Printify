'use client';

import { fetchCustomerProfile, changeProfileImage } from "@/services/Customer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Shield, CheckCircle2Icon, Camera } from "lucide-react";
import { User } from "@/types/prismaTypes";
import { useState } from "react";
import { toast } from "react-toastify";
import ImageCropModal from "@/components/ImageCropModal";

interface ProfilePageProps {
    userId: string;
}

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
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const queryClient = useQueryClient();

    const { data } = useQuery<User>({
        queryKey: ["profile", userId],
        queryFn: () => fetchCustomerProfile({ userId: userId }),
        enabled: !!userId,
    });

    const changeImageMutation = useMutation({
        mutationFn: ({ userId, imageData }: { userId: string; imageData: string }) =>
            changeProfileImage({ userId, imageData }),
        onSuccess: (response) => {
            toast.success("Profile image updated successfully!");
            setIsCropModalOpen(false);
            setUploadSuccess(true);
            queryClient.setQueryData(["profile", userId], (oldData: User) => ({
                ...oldData,
                profile_image: response.user.profile_image
            }));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update profile image");
        }
    });

    const handleCropComplete = (croppedImage: string) => {
        changeImageMutation.mutate({ userId, imageData: croppedImage });
    };

    const handleSuccess = () => {
        if (uploadSuccess) {
            // Refresh the entire page
            window.location.reload();
        }
    };

    if (!data) return null;

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden p-4 mt-12">
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
                                <button
                                    onClick={() => setIsCropModalOpen(true)}
                                    className="absolute bottom-2 right-2 bg-accent text-white p-2 rounded-full shadow-lg hover:bg-highlight transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                    aria-label="Change profile image"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <motion.div variants={itemVariants}>
                                <h1 className="text-5xl font-bold text-highlight mb-2 flex items-center gap-2">
                                    {data.name}
                                    {data.isVerified && (<CheckCircle2Icon className="text-green-500 w-10 h-10" />)}
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

            <ImageCropModal
                isOpen={isCropModalOpen}
                onClose={() => setIsCropModalOpen(false)}
                onCropComplete={handleCropComplete}
                isLoading={changeImageMutation.isPending}
                onSuccess={handleSuccess}
            />
        </div>
    );
}