'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center cursor-pointer justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg transition-all"
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
                    <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3,0,5.8,1.1,7.9,3l6.1-6.1C33.8,5.4,29.1,3,24,3C12.4,3,3,12.4,3,24s9.4,21,21,21c11,0,21-8,21-19.5C45,23.8,44.5,21.8,43.6,20z"></path>
                    <path fill="#FF3D00" d="M6.3,14.7l7.1,5.2C15.3,14.5,19.4,11,24,11c3,0,5.8,1.1,7.9,3l6.1-6.1C33.8,5.4,29.1,3,24,3C16.3,3,9.7,7.8,6.3,14.7z"></path>
                    <path fill="#4CAF50" d="M24,45c5,0,9.6-2.2,12.9-5.8l-6.6-5.5C28,35.8,26,37,24,37c-5.8,0-10.7-4.1-11.7-9.6l-7.1,5.5C8.6,39.6,15.6,45,24,45z"></path>
                    <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.5-2,4.6-4.1,6l6.6,5.5c4.4-4.1,7-10.1,7-17.4C45,23.8,44.5,21.8,43.6,20z"></path>
                </svg>
            )}
            <span className="font-medium">{isLoading ? "Signing in..." : "Sign in with Google"}</span>
        </motion.button>
    );
}