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
            rejection_reason: upload.rejection_reason
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: `profile/upload GET error: ${error}` 
        }, { status: 500 });
    }
}