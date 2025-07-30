import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ uploadId: string }> }
) {
    const { uploadId } = await context.params;
    try {
        const upload = await prisma.upload.findUnique({
            where: { id: uploadId },
            include: {
                customer: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!upload) {
            return NextResponse.json({
                error: "No upload found for this user"
            }, { status: 404 });
        }

        return NextResponse.json({
            id: upload.id,
            filename: upload.filename,
            fileData: upload.fileData,
            status: upload.status,
            customer: upload.customer,
            format: upload.format,
            createdAt: upload.createdAt,
            updatedAt: upload.updatedAt,
            needed_amount: upload.needed_amount,
            rejection_reason: upload.rejection_reason,
            cancel_reason: upload.cancel_reason
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: `profile/upload GET error: ${error}` 
        }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ uploadId: string }> }
) {
    const { uploadId } = await params;
    try {
        const body = await req.json();
        const { cancelReason } = body;

        const upload = await prisma.upload.findUnique({
            where: { id: uploadId }
        });

        if (!cancelReason) {
            return NextResponse.json({
                error: "Cancel reason is required"
            }, { status: 400 });
        }

        if (!upload) {
            return NextResponse.json({
                error: "Upload not found"
            }, { status: 404 });
        }

        if (upload.status !== 'pending') {
            return NextResponse.json({
                error: "Only pending uploads can be cancelled"
            }, { status: 400 });
        }

        const updatedUpload = await prisma.upload.update({
            where: { id: uploadId },
            data: { status: 'cancelled', cancel_reason: cancelReason },
        });

        return NextResponse.json({
            message: "Upload cancelled successfully",
            upload: updatedUpload
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `profile/upload PUT error: ${error}`
        }, { status: 500 });
    }
}