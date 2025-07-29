'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { processSteps } from '@/constants/hero';
import { getSession } from '@/services/Auth';

export default function LandingPage() {
    const [checkingSession, setCheckingSession] = useState<boolean>(false);
    
    const heroRef = useRef<HTMLDivElement>(null);
    const processRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const handleGetStarted = async () => {
        setCheckingSession(true);
        try {
            const session = await getSession();
            if (session) router.push('/upload');
            else router.push('/login');
        } catch (error) {
            console.error(`Error checking session: ${error}`);
            router.push('/login');
        } finally {
            setCheckingSession(false);
        }
    }

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section
                ref={heroRef}
                className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
                style={{ background: 'var(--gradient-primary)' }}
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-bg-accent opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-72 lg:h-72 rounded-full bg-bg-highlight opacity-15 blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl px-4">
                    <motion.h1
                        className="text-4xl xs:text-5xl sm:text-5xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        Welcome to{' '}
                        <span className="text-highlight">Printify</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-bg-soft max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    >
                        Send your document files for printing and we will handle the rest.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleGetStarted}
                            className="bg-primary cursor-pointer hover:bg-text-dark text-highlight font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300"
                            disabled={checkingSession}
                        >
                            Get Started
                        </motion.button>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-8 sm:bottom-10"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </motion.div>
            </section>

            {/* How It Works */}
            <section
                ref={processRef}
                className="py-12 sm:py-16 md:py-20 process-section bg-bg-soft"
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-12 md:mb-16">
                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            How{' '}
                            <span className="text-secondary">Printify</span>{' '}
                            Works
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                        {processSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                className="process-step bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-md text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.7,
                                    delay: i * 0.3,
                                    ease: 'circOut',
                                }}
                            >
                                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-primary text-white text-xl sm:text-2xl font-bold flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                                    {i + 1}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-text-dark">
                                    {step.title}
                                </h3>
                                <p className="text-sm sm:text-base text-text-light">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                ref={ctaRef}
                className="py-12 sm:py-16 md:py-20 cta-section"
                style={{ background: 'var(--gradient-secondary)' }}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 text-text-dark">
                            Ready to Start Your Printing Project?
                        </h2>
                        <p className="text-lg sm:text-xl mb-8 sm:mb-9 md:mb-10 text-text-dark max-w-2xl mx-auto">
                            Get in touch with us today for a free quote and consultation
                        </p>
                        <motion.button
                            className="bg-primary hover:bg-text-dark text-white font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full text-base sm:text-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Request a Quote
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}