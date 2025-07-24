'use server';

import prisma from "@/lib/prisma";
import { generateNotificationMessage } from "@/utils/notifications";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function updateUploadStatus(params: {
    uploadId: string;
    newStatus: string;
    rejectionReason?: string;
    amount?: number;
}) {
    const { uploadId, newStatus, rejectionReason, amount } = params;

    try {
        const existingUpload = await prisma.upload.findUnique({
            where: { id: uploadId },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!existingUpload) {
            throw new Error("Upload not found");
        }

        const updateData: any = {
            status: newStatus,
            updatedAt: new Date(),
        }

        if (newStatus === "rejected") {
            updateData.rejection_reason = rejectionReason || "No reason provided";
        } else {
            updateData.rejection_reason = null;
        }

        if (newStatus === "ready_to_pickup" && amount) {
            updateData.needed_amount = amount;
        }

        const notificationMessage = generateNotificationMessage(
            existingUpload.filename,
            newStatus,
            rejectionReason
        );

        await prisma.notification.create({
            data: {
                uploadId: uploadId,
                message: notificationMessage,
                sentAt: new Date(),
                markAsRead: false,
            },
        });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/send`, {
                userId: existingUpload.customerId,
                notification: {
                    message: notificationMessage,
                    orderId: uploadId,
                    orderFilename: existingUpload.filename,
                    status: newStatus,
                    ...(newStatus === "rejected" && { rejectionReason }),
                    ...(newStatus === "ready_to_pickup" && amount && { amount }),
                    createdAt: new Date().toISOString(),
                    read: false,
                },
            });
            revalidatePath('/admin/orders');

            return { success: true };
        } catch (wsError) {
            console.warn(`⚠️ Failed to send real-time notification: ${wsError}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating upload status:", error);
        throw error;
    }
}