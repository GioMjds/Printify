"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";
import SuccessFallback from "./success-fallback";

export default function UploadPage() {
    const [success, setSuccess] = useState<boolean>(false);
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
                    {/* Centered UploadDropzone */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full flex-1">
                        <div className="glass-card p-10 flex flex-col items-center max-w-xl w-full">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-bg-soft">
                                Upload Your File
                            </h1>
                            <UploadDropzone
                                endpoint="documentUploader"
                                onClientUploadComplete={() => setSuccess(true)}
                                onUploadError={err => setError(err.message)}
                                appearance={{
                                    button: "bg-accent cursor-pointer text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-highlight transition-colors duration-200",
                                    label: {
                                        color: "#E3D095",
                                    },
                                    allowedContent: {
                                        color: "#1e2939"
                                    }
                                }}
                                content={{
                                    label: "Drag and drop your file here or click to select",
                                    allowedContent: "Only .pdf, .docx, and .doc formats are supported."
                                }}
                            />
                            {error && <div className="text-red-600 mt-4">{error}</div>}
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}