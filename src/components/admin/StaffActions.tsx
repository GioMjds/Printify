'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaff, deleteStaff } from "@/services/Admin";
import { useForm } from "react-hook-form";
import { Staff } from "@/types/Admin";
import { toast } from "react-toastify";
import { splitName } from "@/utils/formatters";
import { Pen, Trash2 } from "lucide-react";
import Modal from "../Modal";

export default function StaffActions({ staff }: { staff: Staff }) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const { firstName, middleName, lastName } = splitName(staff.name);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: "onBlur",
        defaultValues: {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: staff.email,
        }
    })

    const updateMutation = useMutation({
        mutationFn: (data: any) => updateStaff(data),
        onSuccess: () => {
            toast.success("Staff member updated successfully");
            queryClient.invalidateQueries({ queryKey: ['adminStaff'] });
            setIsEditing(false);
            reset();
        },
        onError: (error: any) => {
            console.error(`Failed to update staff: ${error}`);
            toast.error(`Failed to update staff: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (data: any) => deleteStaff(data),
        onSuccess: () => {
            toast.success("Staff member deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['adminStaff'] });
            setIsDeleting(false);
        },
        onError: (error: any) => {
            console.error(`Failed to delete staff: ${error}`);
            toast.error(`Failed to delete staff: ${error.message}`);
        }
    });

    const handleEdit = () => {
        reset({ firstName, middleName, lastName, email: staff.email });
        setIsEditing(true);
    };

    const handleDelete = () => setIsDeleting(true);

    const handleConfirmDelete = () => deleteMutation.mutate({ staffId: staff.id })

    const onSubmit = (data: any) => {
        updateMutation.mutate({
            staffId: staff.id,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            email: data.email
        });
    }

    return (
        <div className="flex gap-2">
            <button
                className="cursor-pointer text-white bg-gradient-to-tl from-bg-primary to-bg-accent rounded-lg p-2"
                onClick={handleEdit}
            >
                <Pen className="inline" />
            </button>
            <button
                className="cursor-pointer text-white bg-gradient-to-tl from-bg-primary to-bg-accent rounded-lg p-2"
                onClick={handleDelete}
            >
                <Trash2 className="inline" />
            </button>

            {/* Edit Modal */}
            <AnimatePresence mode="wait">
                {isEditing && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative mx-4">
                            <button
                                className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() => {
                                    reset();
                                    setIsEditing(false);
                                }}
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-primary">Edit Staff Member</h2>
                                <p className="text-sm text-text-light mt-1">Update the details below to edit this staff member</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            {...register("firstName", { required: "First Name is required" })}
                                            placeholder="First Name"
                                            className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <motion.p
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.firstName.message}
                                            </motion.p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            {...register("lastName", { required: "Last Name is required" })}
                                            placeholder="Last Name"
                                            className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <motion.p
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.lastName.message}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        {...register("middleName")}
                                        placeholder="Middle Name (optional)"
                                        className="border-2 border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        placeholder="Staff's email address"
                                        className={`border-2 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-accent/50"
                                            }`}
                                    />
                                    {errors.email && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {errors.email.message}
                                        </motion.p>
                                    )}
                                </div>

                                {updateMutation.isError && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                                        <p className="text-red-700 text-sm">
                                            {updateMutation.error?.name || "An error occurred while updating staff"}
                                        </p>
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    className="cursor-pointer bg-gradient-to-r from-secondary to-accent text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    disabled={updateMutation.isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>
                                            Save Changes
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            {isDeleting && (
                <Modal
                    isOpen={isDeleting}
                    onCancel={() => setIsDeleting(false)}
                    title="Delete Staff Member"
                    description={`Are you sure you want to delete ${staff.name}? This action cannot be undone.`}
                    confirmText="Delete Staff"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    loading={deleteMutation.isPending}
                />
            )}
        </div>
    )
}