/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { resendRegisterOtp, verifyRegisterOtp } from "@/services/Auth";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function VerifyOTP({ email: propEmail = "" }: { email?: string }) {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isCooldown, setIsCooldown] = useState(false);
    const [email, setEmail] = useState<string>(propEmail);

    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem("register_email");
        if (storedEmail) setEmail(storedEmail);
        else router.push("/login");
    }, [router]);

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return await verifyRegisterOtp({
                email: email,
                otp: otp.join("")
            })
        },
        onSuccess: (response) => {
            if (response && response.success) {
                setSuccess("OTP verified successfully!");
            }
            localStorage.removeItem("register_email");
            router.push("/");
        },
        onError: (error: any) => {
            setError(error.response?.data?.error || "An error occurred while verifying OTP.");
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        }
    })

    useEffect(() => {
        if (!propEmail) {
            const storedEmail = localStorage.getItem("register_email");
            if (storedEmail) setEmail(storedEmail);
        }
    }, [propEmail]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isCooldown) {
            timer = setInterval(() => {
                setCooldownTime((prevTime) => {
                    if (prevTime <= 1) {
                        setIsCooldown(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isCooldown]);

    const formatCooldownTime = () => {
        const minutes = Math.floor(cooldownTime / 60);
        const seconds = cooldownTime % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const handleChange = (index: number, value: string) => {
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) inputRefs.current[index + 1]?.focus();
        } else if (value === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
        const newOtp = [...otp];
        pasteData.split("").forEach((char, i) => {
            if (i < 6 && /^[0-9]$/.test(char)) {
                newOtp[i] = char;
            }
        });
        setOtp(newOtp);
        const lastFilledIndex = pasteData.split("").findIndex(c => !c) - 1;
        inputRefs.current[Math.min(5, lastFilledIndex)]?.focus();
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setResendMessage(null);
        setError(null);
        try {
            const response = await resendRegisterOtp(email);
            if (response && response.message) {
                setResendMessage("OTP resent successfully!");
                setCooldownTime(60);
                setIsCooldown(true);
            }
        } catch (error) {
            console.error(`Error resending OTP: ${error}`);
            setError("Failed to resend OTP. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-accent)]">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center border border-[var(--color-border-light)] backdrop-blur-md"
            >
                <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2 tracking-tight">Verify Your Account</h1>
                {email && (
                    <div className="mb-2 text-lg font-semibold text-[var(--color-primary)] break-all">{email}</div>
                )}
                <p className="text-[var(--color-text-light)] mb-6 text-center text-base">
                    Enter the 6-digit code sent to your email to verify your account.
                </p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutate();
                    }}
                    className="w-full flex flex-col gap-4"
                >
                    <div className="flex justify-center gap-2 mb-2">
                        {otp.map((value, i) => (
                            <input
                                key={i}
                                ref={el => { inputRefs.current[i] = el; }}
                                type="text"
                                maxLength={1}
                                className="w-10 h-12 text-center text-2xl font-semibold border-b-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] bg-transparent transition-colors duration-200"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={value}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                                disabled={isPending}
                            />
                        ))}
                    </div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-center font-medium"
                        >
                            {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 text-center font-medium"
                        >
                            {success}
                        </motion.p>
                    )}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.03 }}
                        type="submit"
                        className={`w-full py-2 rounded-lg bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${isPending ? "opacity-50 cursor-not-allowed" : " cursor-pointer"}`}
                        disabled={otp.some(num => num === "") || isPending}
                    >
                        {isPending ? "Verifying..." : "Verify OTP"}
                    </motion.button>
                </form>
                <div className="mt-6 text-sm text-[var(--color-text-light)]">
                    Didn&apos;t receive a code? {isCooldown ? (
                        <span className="text-gray-400">Resend available in {formatCooldownTime()}</span>
                    ) : (
                        <button
                            className={`text-[var(--color-accent)] hover:underline font-medium ${resendLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleResendOtp}
                            disabled={resendLoading || isCooldown}
                        >
                            {resendLoading ? "Resending..." : "Resend"}
                        </button>
                    )}
                </div>
                {resendMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-center font-medium mt-2"
                    >
                        {resendMessage}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}