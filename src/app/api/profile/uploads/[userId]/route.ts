import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    const { userId } = await context.params;
    try {
        const userUploads = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                uploads: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!userUploads) {
            return NextResponse.json({ 
                error: "User uploads not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            uploads: userUploads.uploads,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `profile/uploads/[userId] GET error: ${error}`
        }, { status: 500 });
    }
}