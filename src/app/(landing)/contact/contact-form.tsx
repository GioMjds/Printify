"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { sendContactForm } from "@/services/Customer";

type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await sendContactForm({ ...data });
            toast.success("Your message has been sent successfully!");
            reset();
        } catch (error) {
            console.error(`Error sending contact form: ${error}`);
            toast.error("There was an error sending your message. Please try again.");
        }
    };

    return (
        <>
            <h2 className="text-2xl text-center font-bold text-highlight mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name
                    </label>
                    <input
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-3 text-gray-300 border border-border-light rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Your name"
                    />
                    {errors.name && (
                        <motion.p 
                            className="mt-1 text-sm text-red-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {errors.name.message}
                        </motion.p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        className="w-full px-4 py-3 text-gray-300 border border-border-light rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="your.email@example.com"
                    />
                    {errors.email && (
                        <motion.p 
                            className="mt-1 text-sm text-red-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {errors.email.message}
                        </motion.p>
                    )}
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                        Subject
                    </label>
                    <input
                        id="subject"
                        {...register("subject", { required: "Subject is required" })}
                        className="w-full px-4 py-3 text-gray-300 border border-border-light rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="What's this about?"
                    />
                    {errors.subject && (
                        <motion.p 
                            className="mt-1 text-sm text-red-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {errors.subject.message}
                        </motion.p>
                    )}
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        {...register("message", {
                            required: "Message is required",
                            minLength: {
                                value: 10,
                                message: "Message must be at least 10 characters",
                            },
                        })}
                        className="w-full px-4 py-3 text-gray-300 resize-none border border-border-light rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Your message here..."
                    />
                    {errors.message && (
                        <motion.p 
                            className="mt-1 text-sm text-red-600"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {errors.message.message}
                        </motion.p>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 bg-gradient-to-r from-secondary to-accent text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-opacity ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            "Send Message"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}