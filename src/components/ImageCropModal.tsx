'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { motion } from 'framer-motion';
import { X, Upload, Check } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedImage: string) => void;
    isLoading?: boolean;
    onSuccess?: () => void;
}

export default function ImageCropModal({
    isOpen,
    onClose,
    onCropComplete,
    isLoading = false,
    onSuccess
}: ImageCropModalProps) {
    const [src, setSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
        }
    }, []);

    const getCroppedImg = useCallback(() => {
        if (!completedCrop || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return canvas.toDataURL('image/jpeg', 0.9);
    }, [completedCrop]);

    const handleCropComplete = () => {
        const croppedImage = getCroppedImg();
        if (croppedImage) {
            onCropComplete(croppedImage);
        }
    };

    const handleClose = () => {
        setSrc('');
        setCompletedCrop(undefined);
        onClose();
    };

    useEffect(() => {
        if (!isOpen && onSuccess) {
            const timeoutId = setTimeout(() => {
                onSuccess();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen, onSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-primary">Update Profile Image</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!src ? (
                        <div className="text-center py-8">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onSelectFile}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-accent cursor-pointer text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:bg-highlight transition"
                                disabled={isLoading}
                            >
                                <Upload className="w-5 h-5" />
                                Select Image
                            </button>
                            <p className="text-gray-500 mt-3">Choose an image to crop for your profile</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={1}
                                    circularCrop
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop preview"
                                        src={src}
                                        className="max-w-full max-h-96 object-contain"
                                    />
                                </ReactCrop>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setSrc('')}
                                    className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    disabled={isLoading}
                                >
                                    Choose Different Image
                                </button>
                                <button
                                    onClick={handleCropComplete}
                                    disabled={!completedCrop || isLoading}
                                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${completedCrop && !isLoading
                                            ? 'bg-accent cursor-pointer text-white hover:bg-highlight'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Update Profile Image
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}