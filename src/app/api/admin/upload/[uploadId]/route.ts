import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ uploadId: string }> }
) {
    const { uploadId } = await context.params;
    try {
        const printUpload = await prisma.upload.findUnique({
            where: { id: uploadId },
            include: {
                customer: {
                    select: { name: true }
                }
            }
        });

        if (!printUpload) {
            return NextResponse.json({
                error: "Upload not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            id: printUpload.id,
            filename: printUpload.filename,
            fileData: printUpload.fileData,
            status: printUpload.status,
            needed_amount: printUpload.needed_amount,
            customer: printUpload.customer.name,
            createdAt: printUpload.createdAt,
            updatedAt: printUpload.updatedAt,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `admin/upload/[uploadId] GET error: ${error}`
        }, { status: 500 });
    }
}