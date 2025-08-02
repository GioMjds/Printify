'use client';

import { motion } from "framer-motion";

export default function AnnouncementBar() {
    return (
        <motion.section 
            className="fixed top-0 left-0 w-full z-[110] bg-accent text-white text-center py-3 shadow-xl"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
        >
            <p className="text-md font-semibold">
                Printify is currently in development. Thank you for your support!
            </p>
        </motion.section>
    )
}