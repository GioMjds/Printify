'use client';

import { fetchCustomerProfile, changeProfileImage } from "@/services/Customer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, CheckCircle2Icon, Camera } from "lucide-react";
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
    const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
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
        if (uploadSuccess) window.location.reload();
    };

    if (!data) return null;

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden px-4 sm:px-6 pt-16 pb-8">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Profile Header */}
                <motion.div
                    className="glass-card p-6 sm:p-8 mb-6 sm:mb-8 backdrop-blur-xl"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                        {/* Profile Image - Left side on md and larger */}
                        <div className="relative group md:flex-shrink-0">
                            <div className="relative bg-white p-1 sm:p-2 rounded-full">
                                <Image
                                    src={data.profile_image as string}
                                    alt="Profile"
                                    width={160}
                                    height={160}
                                    className="rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 ring-2 sm:ring-4 ring-white/50 shadow-lg sm:shadow-2xl"
                                />
                                <button
                                    onClick={() => setIsCropModalOpen(true)}
                                    className="absolute cursor-pointer bottom-1 right-1 sm:bottom-2 sm:right-2 bg-accent text-white p-1.5 sm:p-4 rounded-full shadow-md hover:bg-highlight transition-colors duration-200"
                                    aria-label="Change profile image"
                                >
                                    <Camera className="w-7 h-7" size={56} />
                                </button>
                            </div>
                        </div>

                        {/* Profile Details - Right side on md and larger */}
                        <div className="flex-1 text-center md:text-left space-y-3 sm:space-y-4">
                            <motion.div variants={itemVariants}>
                                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-highlight mb-1 sm:mb-2 flex items-center justify-center md:justify-start gap-1 sm:gap-2">
                                    {data.name}
                                    {data.isVerified && (
                                        <CheckCircle2Icon className="text-green-500 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                                    )}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2 text-highlight text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-4">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>{data.email}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                {isCropModalOpen && (
                    <ImageCropModal
                        isOpen={isCropModalOpen}
                        onClose={() => setIsCropModalOpen(false)}
                        onCropComplete={handleCropComplete}
                        isLoading={changeImageMutation.isPending}
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}