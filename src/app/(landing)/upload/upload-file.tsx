/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";
import SuccessFallback from "./success-fallback";

export default function UploadPage() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            {success ? (
                <SuccessFallback />
            ) : (
                <main className="flex flex-col items-center justify-center min-h-screen p-4 mt-8 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-bg-accent opacity-20 rounded-full blur-3xl z-0" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight opacity-15 rounded-full blur-3xl z-0" />
                    {/* Card + Preview Side by Side */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12">
                        {/* Upload Card */}
                        <div className="glass-card p-10 flex flex-col items-center max-w-xl w-full md:w-2/3 lg:w-1/2">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
                                Upload Your File
                            </h1>
                            <p className="text-md text-gray-800 mb-8 text-center">
                                Only .pdf, .docx, and .doc formats are supported.
                            </p>
                            <UploadDropzone
                                endpoint="documentUploader"
                                onClientUploadComplete={() => setSuccess(true)}
                                onUploadError={err => setError(err.message)}
                                appearance={{
                                    button: "bg-accent text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-highlight transition-colors duration-200",
                                    label: "text-accent font-semibold",
                                }}
                            />
                            {error && <div className="text-red-600 mt-4">{error}</div>}
                        </div>
                        {/* Preview Side (optional, can add preview logic here if needed) */}
                        <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center mt-8 md:mt-0">
                            {/* You can add a preview or illustration here if desired */}
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}