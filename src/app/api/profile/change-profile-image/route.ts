import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, imageData } = body;

        if (!userId || !imageData) {
            return NextResponse.json({
                error: "Bad Request: Missing userId or imageData"
            }, { status: 400 });
        }

        const uploadResponse = await cloudinary.uploader.upload(imageData, {
            folder: "printify/profiles",
            public_id: `user-${userId}`,
            overwrite: true,
            resource_type: "image",
            transformation: [
                { width: 400, height: 400, crop: "fill" },
                { quality: "auto", fetch_format: "auto" }
            ]
        });
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profile_image: uploadResponse.secure_url },
            select: {
                id: true,
                name: true,
                email: true,
                profile_image: true,
                role: true,
                isVerified: true
            }
        });

        return NextResponse.json({
            message: "Profile image updated successfully",
            user: updatedUser
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `change-profile-image PUT error: ${error}`
        }, { status: 500 });
    }
}