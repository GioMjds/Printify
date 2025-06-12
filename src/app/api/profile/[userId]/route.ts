import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string }}) {
    const { userId } = await params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                uploads: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image,
            role: user.role,
            uploads: user.uploads,
            createdAt: user.createdAt,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: "Failed to fetch profile" 
        }, { status: 500 });
    }
}