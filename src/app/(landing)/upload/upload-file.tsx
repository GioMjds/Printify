'use client';

import { motion } from 'framer-motion';

export default function UploadFilePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative Blobs */}
            <motion.div
                className="absolute top-0 left-0 w-72 h-72 bg-bg-accent opacity-20 rounded-full blur-3xl z-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight opacity-15 rounded-full blur-3xl z-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Card Container */}
            <motion.div
                className="relative z-10 bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-4 text-primary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Upload Your File
                </motion.h1>
                <motion.p
                    className="text-lg text-text-light mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Select your design or document to get started with Printify’s premium printing services.
                </motion.p>

                {/* Upload Area */}
                <motion.label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-accent rounded-xl cursor-pointer bg-bg-soft hover:bg-bg-highlight transition-colors duration-200 group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <svg className="w-12 h-12 text-accent mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    <span className="text-accent font-semibold">
                        Click to upload or drag & drop
                    </span>
                    <input
                        id="file-upload"
                        type="file"
                        accept='.doc, .docx, .pdf'
                        className="hidden"
                    // onChange={handleFileChange} // Add your handler here
                    />
                </motion.label>
            </motion.div>
        </main>
    );
}