import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    const { userId } = await context.params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    try {
        const uploads = await prisma.upload.findMany({
            where: { customerId: userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });

        const totalCount = await prisma.upload.count({
            where: { customerId: userId }
        });

        if (!uploads) {
            return NextResponse.json({ 
                error: "User uploads not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            uploads,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: page * limit < totalCount,
                hasPreviousPage: page > 1
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `profile/uploads/[userId] GET error: ${error}`
        }, { status: 500 });
    }
}
