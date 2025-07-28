"use client";

import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import SuccessFallback from "./success-fallback";

export default function UploadPage() {
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            {success ? (
                <SuccessFallback />
            ) : (
                <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 bg-gradient-to-br from-bg-primary to-bg-secondary relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-bg-accent opacity-20 rounded-full blur-2xl sm:blur-3xl z-0" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-bg-highlight opacity-15 rounded-full blur-2xl sm:blur-3xl z-0" />
                    
                    {/* Centered UploadDropzone */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full flex-1">
                        <div className="glass-card p-6 sm:p-8 md:p-10 flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-bg-soft text-center">
                                Upload Your File
                            </h1>
                            <UploadDropzone
                                endpoint="documentUploader"
                                onClientUploadComplete={() => setSuccess(true)}
                                onUploadError={err => setError(err.message)}
                                appearance={{
                                    button: "bg-accent cursor-pointer text-white px-4 sm:px-5 md:px-6 py-1 sm:py-2 rounded-lg font-bold shadow hover:bg-highlight transition-colors duration-200 text-sm sm:text-base",
                                    label: {
                                        color: "#E3D095",
                                        fontSize: "0.875rem",
                                        lineHeight: "1.25rem"
                                    },
                                    allowedContent: {
                                        color: "#1e2939",
                                        fontSize: "0.75rem",
                                        lineHeight: "1rem"
                                    },
                                    container: {
                                        padding: "1rem"
                                    }
                                }}
                                content={{
                                    label: "Drag and drop your file here or click to select",
                                    allowedContent: "Only .pdf, .docx, and .doc formats are supported."
                                }}
                            />
                            {error && (
                                <div className="text-red-600 mt-3 sm:mt-4 text-sm sm:text-base text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}