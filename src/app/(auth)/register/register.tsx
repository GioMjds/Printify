/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import logo from "@/../public/printify_logo.png";
import { sendRegisterOtp } from "@/services/Auth";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm<RegisterForm>({
        mode: "onBlur",
    });

    const password = watch("password");

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: RegisterForm) => {
            return await sendRegisterOtp({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword
            });
        },
        onSuccess: (response) => {
            console.table(`User Details: ${response}`)
            if (response && response.email) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("register_email", response.email);
                }
                router.push("/verify");
            }
        },
        onError: (error: any) => {
            console.error(`Error registering: ${error}`);
            const errData = error.response?.data;
            const errorMessage = errData?.error;
            const statusCode = error.response?.status;

            if (statusCode === 400) {
                setError("email", {
                    message: errorMessage,
                    type: "400"
                });
                return;
            }

            if (errData && errorMessage) {
                if (errorMessage.toLowerCase().includes("user already exists")) {
                    setError("email", {
                        message: errorMessage,
                        type: "400"
                    });
                } else if (errorMessage.toLowerCase().includes("passwords do not match")) {
                    setError("confirmPassword", {
                        message: errorMessage,
                        type: "400"
                    });
                }
            } else {
                setError("root.serverError", {
                    message: errorMessage,
                    type: "500"
                });
            }
        }
    });

    const onSubmit: SubmitHandler<RegisterForm> = (data) => mutate(data);

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            {/* Full-page loading overlay */}
            {isPending && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-4 text-white font-semibold text-2xl">Registering account....</span>
                </div>
            )}
            <motion.div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <div className="flex items-center justify-center gap-3">
                    <Image
                        src={logo}
                        alt="Printify Logo"
                        width={28}
                        height={28}
                        priority
                    />
                    <span className="text-2xl font-bold text-primary">Printify</span>
                </div>
                <h2 className="text-3xl font-bold text-center text-primary -mt-3">
                    Create Account
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="text-sm text-gray-600 font-semibold tracking-tighter">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                {...register("firstName", { required: "First name is required" })}
                                className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                            />
                            {errors.firstName && (
                                <span className="text-xs text-red-500">{errors.firstName.message}</span>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="lastName" className="text-sm text-gray-600 font-semibold tracking-tighter">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                {...register("lastName", { required: "Last name is required" })}
                                className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                            />
                            {errors.lastName && (
                                <span className="text-xs text-red-500">{errors.lastName.message}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm text-gray-600 font-semibold tracking-tighter">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                        />
                        {errors.email && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm"
                            >
                                {errors.email.message}
                            </motion.span>
                        )}
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="text-sm text-gray-600 font-semibold tracking-tighter">Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                        />
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute cursor-pointer right-3 top-2/3 -translate-y-1/2 text-text-light hover:text-primary"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            aria-label="Toggle password visibility"
                        >
                            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="xl" />
                        </motion.button>
                    </div>
                    {errors.password && (
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm -mt-3"
                        >
                            {errors.password.message}
                        </motion.span>
                    )}
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="text-sm text-gray-600 font-semibold tracking-tighter">Confirm Password</label>
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                        />
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute cursor-pointer right-3 top-2/3 -translate-y-1/2 text-text-light hover:text-primary transition"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            aria-label="Toggle confirm password visibility"
                        >
                            <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} size="xl" />
                        </motion.button>
                    </div>
                    {errors.confirmPassword && (
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm -mt-3"
                        >
                            {errors.confirmPassword.message}
                        </motion.span>
                    )}
                    <motion.button
                        type="submit"
                        disabled={isPending}
                        className={`mt-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all flex items-center justify-center ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isPending ? "Registering..." : "Register"}
                    </motion.button>
                </form>
                <div className="flex justify-center items-center mt-2">
                    <Link href="/login" className="text-sm text-accent hover:underline">
                        Already have an account? Log in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}