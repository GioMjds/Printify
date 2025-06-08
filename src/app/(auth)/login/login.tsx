'use client';

import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/printify_logo.png";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { login } from "@/services/Auth";

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
                else router.push("/");
            }
            console.log(`Login successful! ${response.user.role}`);
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
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
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
                        width={72}
                        height={72}
                        priority
                    />
                    <span className="text-2xl font-bold text-primary">Printify</span>
                </div>
                <h2 className="text-3xl font-bold text-center text-primary -mt-3">
                    Welcome Back
                </h2>
                <p className="text-center text-text-light -mt-4">
                    Log in to your Printify account
                </p>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                }
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
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long",
                                }
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                        />
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition"
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
                            className="text-red-500 text-sm"
                        >
                            {errors.password.message}
                        </motion.span>
                    )}
                    <motion.button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Login
                    </motion.button>
                </form>
                <div className="flex justify-between items-center">
                    <Link href="/forgot-password" className="text-sm text-accent hover:underline">
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