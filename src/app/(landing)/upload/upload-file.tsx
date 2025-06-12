"use client";

import Modal from "@/components/Modal";
import { uploadFile } from "@/services/Upload";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import SuccessFallback from "./success-fallback";

export default function UploadPage({ customerId }: { customerId?: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "docx" | 'doc' | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setError(null);
            const ext = selectedFile.name.split(".").pop()?.toLowerCase();
            if (ext === "pdf") {
                setPreviewUrl(URL.createObjectURL(selectedFile));
                setPreviewType("pdf");
            } else if (ext === "docx") {
                setPreviewUrl(URL.createObjectURL(selectedFile));
                setPreviewType("docx");
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleConfirmSubmit = async () => {
        setShowModal(false);
        setLoading(true);
        setError(null);
        try {
            if (!file) {
                setError("Please select a file to upload.");
                setLoading(false);
                return;
            }
            if (!customerId) {
                setError("Customer ID is missing.");
                setLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append("file", file);
            formData.append("customerId", customerId);

            const data = await uploadFile(formData);
            if (data.uploadId) {
                setSuccess(true);
            } else {
                setError("Upload failed: No upload ID returned.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        setShowModal(true);
    };

    return (
        <>
            {success ? (
                <SuccessFallback />
            ) : (
                <main className="flex flex-col items-center justify-center min-h-screen p-4 mt-8 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
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
                    {/* Card + Preview Side by Side */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12">
                        {/* Upload Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-xl w-full md:w-2/3 lg:w-1/2"
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
                                className="text-md text-text-light mb-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                Note: Only .pdf file format are supported for now.
                            </motion.p>
                            <motion.label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-accent rounded-xl cursor-pointer bg-bg-soft hover:bg-bg-highlight transition-colors duration-200 group mb-6"
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
                                    {file ? file.name : "Click to upload or drag & drop"}
                                </span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept='.pdf'
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </motion.label>
                            {error && <div className="text-red-600 mb-4">{error}</div>}
                            <button
                                type="button"
                                className="bg-accent cursor-pointer text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-highlight transition-colors duration-200 disabled:opacity-60"
                                disabled={loading}
                                onClick={() => handleSubmit(new Event('submit', { cancelable: true, bubbles: true }) as any)}
                            >
                                {loading ? "Uploading..." : "Submit"}
                            </button>
                        </motion.form>
                        {/* Preview Section */}
                        <motion.div
                            className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center mt-8 md:mt-0"
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        >
                            <div className="w-full text-center mb-2 text-lg font-semibold text-highlight">Preview</div>
                            {file ? (
                                previewType === "pdf" && previewUrl ? (
                                    <iframe
                                        src={previewUrl}
                                        title="Document Preview"
                                        className="w-full h-[35rem] border rounded-lg shadow-md bg-white"
                                        style={{ minHeight: '32rem' }}
                                        allow="autoplay"
                                    />
                                ) : (previewType === "docx" || previewType === "doc") ? (
                                    <div className="w-full p-4 bg-blue-100 text-blue-800 rounded-lg text-center">
                                        Preview for DOCX/DOC files is available after upload.<br />
                                        Please submit to view the document online.
                                    </div>
                                ) : (
                                    <div className="w-full p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                                        Preview not available. Only PDF, DOC, and DOCX files can be previewed.
                                    </div>
                                )
                            ) : (
                                <div className="w-full p-4 bg-gray-100 text-gray-400 rounded-lg text-center">
                                    No file selected.
                                </div>
                            )}
                        </motion.div>
                    </div>
                    <Modal
                        isOpen={showModal}
                        onCancel={() => setShowModal(false)}
                        onConfirm={handleConfirmSubmit}
                        title="Confirm Print Order"
                        description="Are you sure you want to submit this file for print order?"
                        confirmText="Yes, Submit"
                        cancelText="Cancel"
                        loading={loading}
                    />
                </main>
            )}
        </>
    );
}