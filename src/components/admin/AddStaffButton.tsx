"use client";

import { addNewStaff } from "@/services/Admin";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserPlus2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AddStaffButton() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const addMutation = useMutation({
        mutationFn: async (data: any) => {
            return await addNewStaff({
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                role: "staff",
            });
        },
        onSuccess: () => {
            toast.success("Staff member added successfully!");
            reset();
            setModalOpen(false);
        }
    });

    const onSubmit = (data: any) => {
        if (data.password !== data.confirmPassword) {
            return;
        }
        addMutation.mutate(data);
    };

    const password = watch("password");

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Manage Staff</h1>
                <p className="text-text-light">View and manage all staff members. Only admins can add staff.</p>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary cursor-pointer hover:bg-accent text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
                onClick={() => setModalOpen(true)}
            >
                <span><UserPlus2 className="inline-block" />  Add Staff Member</span>
            </motion.button>

            <AnimatePresence mode="wait">
                {modalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative mx-4">
                            <button
                                className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() => {
                                    reset();
                                    setModalOpen(false);
                                }}
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-primary">Add Staff Member</h2>
                                <p className="text-sm text-text-light mt-1">Fill in the details below to add a new staff member</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <input
                                            type="text"
                                            {...register("firstName", { required: "First Name is required" })}
                                            placeholder="First Name"
                                            className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <motion.p
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                {errors.firstName.message}
                                            </motion.p>
                                        )}
                                    </div>
                                    <div className="w-1/2">
                                        <input
                                            type="text"
                                            {...register("lastName", { required: "Last Name is required" })}
                                            placeholder="Last Name"
                                            className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <motion.p
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                {errors.lastName.message}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        {...register("middleName")}
                                        placeholder="Middle Name (optional)"
                                        className="border-2 border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        placeholder="Staff's email address"
                                        className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                            }`}
                                    />
                                    {errors.email && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {errors.email.message}
                                        </motion.p>
                                    )}
                                </div>
                                <div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters"
                                                }
                                            })}
                                            placeholder="Password"
                                            className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                                }`}
                                        />
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="xl" />
                                        </motion.button>
                                    </div>
                                    {errors.password && (
                                        <motion.span
                                            className="text-red-500 text-xs -mt-3"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {errors.password.message}
                                        </motion.span>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: value =>
                                                    value === password || "Passwords do not match"
                                            })}
                                            placeholder="Confirm Password"
                                            className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                                }`}
                                        />
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-accent transition-colors"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} size="xl" />
                                        </motion.button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <motion.span
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {errors.confirmPassword.message}
                                        </motion.span>
                                    )}
                                </div>

                                {addMutation.isError && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                                        <p className="text-red-700 text-sm">
                                            {addMutation.error?.name || "An error occurred while adding staff"}
                                        </p>
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    className="cursor-pointer bg-gradient-to-r from-secondary to-accent text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    disabled={addMutation.isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {addMutation.isPending ? (
                                        <>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Adding Staff...</span>
                                        </>
                                    ) : (
                                        <span>
                                            <UserPlus2 className="inline-block mr-2" />
                                            Add Staff
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}