/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import logo from "@/../public/printify_logo.png";
import { login } from "@/services/Auth";
import { faDoorOpen, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
        mode: "onBlur",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: LoginForm) => {
            return await login({ email: data.email, password: data.password });
        },
        onSuccess: (response) => {
            if (response?.user) {
                if (response.user.role === 'admin') router.push("/admin");
                else if (response.user.role === 'staff') router.push('/admin/orders');
                else router.push("/");
            }
        },
        onError: (error: any) => {
            console.error(`Login failed: ${error}`);
            const errData = error?.response?.data;
            const statusCode = error?.response?.status;

            if (statusCode === 403) {
                setError("email", {
                    message: errData?.error,
                    type: "403"
                });
                return;
            }

            if (errData && errData.error) {
                const msg = errData.error;
                if (msg.toLowerCase().includes("user does not exist")) {
                    setError('email', { message: msg, type: "404" });
                } else if (msg.toLowerCase().includes("password")) {
                    setError('password', { message: msg, type: "401" });
                } else {
                    setError('root.serverError', { message: msg, type: "500" });
                }
            }
        }
    });

    const onSubmit: SubmitHandler<LoginForm> = (data) => mutate(data)

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary relative">
            {/* Full-page loading overlay */}
            {isPending && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-4 text-white font-semibold text-2xl">Logging in....</span>
                </div>
            )}
            <motion.div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
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
                    Welcome to Printify!
                </h2>
                <p className="text-center text-text-light -mt-4">
                    Log in to your Printify account
                </p>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="text-sm text-gray-600 font-semibold tracking-tighter">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                }
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                            disabled={isPending}
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
                                    message: "Password must be at least 6 characters long",
                                }
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                            disabled={isPending}
                        />
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute cursor-pointer right-3 top-2/3 -translate-y-1/2 text-text-light hover:text-primary transition"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            aria-label="Toggle password visibility"
                            disabled={isPending}
                        >
                            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="xl" />
                        </motion.button>
                    </div>
                    {errors.password && (
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm"
                        >
                            {errors.password.message}
                        </motion.span>
                    )}
                    <motion.button
                        type="submit"
                        disabled={isPending}
                        className={`mt-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isPending ? 
                            "Logging in..." : 
                        <>
                            <LogIn className="inline-block mr-2" size={28} />
                            Log In
                        </>
                        }
                    </motion.button>
                </form>
                <div className="flex justify-between items-center">
                    <Link href="/forgot" className="text-sm text-accent hover:underline">
                        Forgot password?
                    </Link>
                    <Link href="/register" className="text-sm text-accent hover:underline">
                        Create account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}