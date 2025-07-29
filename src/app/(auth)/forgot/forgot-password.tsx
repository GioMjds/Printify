'use client';

import { resetForgotPassword, sendForgotOtp, verifyForgotOtp } from "@/services/Auth";
import { Step, EmailFormData, OtpFormData, PasswordFormData } from "@/types/CustomerAuth";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>(Step.email);
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const emailForm = useForm<EmailFormData>({
        mode: "onChange",
        defaultValues: { email: "" }
    });
    const otpForm = useForm<OtpFormData>({
        mode: "onChange",
        defaultValues: { otp: "" }
    });
    const passwordForm = useForm<PasswordFormData>({
        mode: "onChange",
        defaultValues: { newPassword: "", confirmPassword: "" }
    });

    const sendOtpMutation = useMutation({
        mutationFn: (email: string) => sendForgotOtp({ email }),
        onSuccess: () => {
            setStep(Step.otp);
            setEmail(emailForm.getValues("email"));
            emailForm.reset();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || 'Failed to send OTP.';
            emailForm.setError("email", { message: errorMessage });
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: (data: { email: string; otp: string }) => verifyForgotOtp({ email: data.email, otp: data.otp }),
        onSuccess: () => {
            setStep(Step.newPassword);
            setOtp(otpForm.getValues("otp"));
            otpForm.reset();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || "OTP verification failed.";
            otpForm.setError("otp", { message: errorMessage });
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (data: { email: string; otp: string; newPassword: string }) => resetForgotPassword(data),
        onSuccess: () => {
            router.push("/login");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || "Password reset failed.";
            passwordForm.setError("newPassword", { message: errorMessage });
        }
    });

    const handleEmailSubmit = emailForm.handleSubmit((data) => {
        sendOtpMutation.mutate(data.email);
    });

    const handleOtpSubmit = otpForm.handleSubmit((data) => {
        verifyOtpMutation.mutate({ email, otp: data.otp });
    });

    const handleNewPasswordSubmit = passwordForm.handleSubmit((data) => {
        if (data.newPassword !== data.confirmPassword) {
            passwordForm.setError("confirmPassword", { message: "Passwords do not match." });
            return;
        }
        resetPasswordMutation.mutate({ email, otp, newPassword: data.newPassword });
    });

    const resendOtp = () => {
        if (email) sendOtpMutation.mutate(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-bg-accent">
            <motion.div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <h2 className="text-3xl font-bold text-center text-primary mb-2">Forgot Password</h2>
                {step === Step.email && (
                    <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit}>
                        <label className="font-semibold text-text-primary">Enter your email address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                            placeholder="Your email address"
                            {...emailForm.register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {emailForm.formState.errors.email && (
                            <div className="text-red-500 text-center font-medium">{emailForm.formState.errors.email.message}</div>
                        )}
                        <motion.button
                            type="submit"
                            className="mt-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={sendOtpMutation.isPending || !emailForm.formState.isValid}
                        >
                            {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
                        </motion.button>
                    </form>
                )}
                {step === Step.otp && (
                    <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
                        <label className="font-semibold text-text-primary">Enter the OTP sent to your email</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                            placeholder="6-digit OTP"
                            maxLength={6}
                            {...otpForm.register("otp", { required: "OTP is required" })}
                        />
                        {otpForm.formState.errors.otp && (
                            <div className="text-red-500 text-center font-medium">{otpForm.formState.errors.otp.message}</div>
                        )}
                        <motion.button
                            type="submit"
                            className="mt-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={verifyOtpMutation.isPending || !otpForm.formState.isValid}
                        >
                            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                        </motion.button>
                        <button type="button" className="text-accent underline mt-2" onClick={resendOtp} disabled={sendOtpMutation.isPending}>Resend OTP</button>
                    </form>
                )}
                {step === Step.newPassword && (
                    <form className="flex flex-col gap-4" onSubmit={handleNewPasswordSubmit}>
                        <label className="font-semibold text-text-primary">Enter your new password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                                placeholder="New Password"
                                {...passwordForm.register("newPassword", {
                                    required: "New password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary"
                                tabIndex={-1}
                                onClick={() => setShowNewPassword((v) => !v)}
                                aria-label="Toggle new password visibility"
                            >
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {passwordForm.formState.errors.newPassword && (
                            <div className="text-red-500 text-center font-medium">{passwordForm.formState.errors.newPassword.message}</div>
                        )}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-accent transition"
                                placeholder="Confirm New Password"
                                {...passwordForm.register("confirmPassword", {
                                    required: "Confirm password is required",
                                })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary"
                                tabIndex={-1}
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label="Toggle confirm password visibility"
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {passwordForm.formState.errors.confirmPassword && (
                            <div className="text-red-500 text-center font-medium">{passwordForm.formState.errors.confirmPassword.message}</div>
                        )}
                        <motion.button
                            type="submit"
                            className="mt-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={resetPasswordMutation.isPending || !passwordForm.formState.isValid}
                        >
                            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}