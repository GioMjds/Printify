'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { processSteps } from '@/constants/hero';

export default function LandingPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const processRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section
                ref={heroRef}
                className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
                style={{ background: 'var(--gradient-primary)' }}
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-bg-accent opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-bg-highlight opacity-15 blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl">
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold mb-6 text-white"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        Bring Your{' '}
                        <span className="text-highlight">Designs</span> to Life
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl mb-10 text-bg-soft max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    >
                        Premium printing services for your business, events, and personal
                        projects
                    </motion.p>

                    <motion.div
                        className="hero-title flex flex-wrap justify-center gap-4"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                    >
                        <Link
                            href="/login"
                            className="bg-primary hover:bg-text-dark text-highlight font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-10"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
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
                className="py-20 process-section bg-bg-soft"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-4 text-primary"
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

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {processSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                className="process-step bg-white p-6 rounded-xl shadow-md text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.7,
                                    delay: i * 0.3,
                                    ease: 'circOut',
                                }}
                            >
                                <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-text-dark">
                                    {step.title}
                                </h3>
                                <p className="text-text-light">
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
                className="py-20 cta-section"
                style={{ background: 'var(--gradient-secondary)' }}
            >
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-dark">
                            Ready to Start Your Printing Project?
                        </h2>
                        <p className="text-xl mb-10 text-text-dark max-w-2xl mx-auto">
                            Get in touch with us today for a free quote and consultation
                        </p>
                        <motion.button
                            className="bg-primary hover:bg-text-dark text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300"
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