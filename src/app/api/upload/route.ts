import prisma from "@/lib/prisma";
import { v2 as cloudinary } from 'cloudinary';
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const allowedExtensions = ['.doc', '.docx', '.pdf'];

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    secure: true,
});

export const config = {
    api: {
        bodyParser: false,
    }
}

export async function POST(req: NextRequest) {
    const contentType = req.headers.get("Content-Type") || "";
    if (
        !contentType.startsWith("multipart/form-data") &&
        !contentType.startsWith("application/x-www-form-urlencoded")
    ) {
        return NextResponse.json(
            { error: 'Content-Type must be "multipart/form-data" or "application/x-www-form-urlencoded".' },
            { status: 415 }
        );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const customerId = formData.get('customerId') as string | null;

    if (!file || !customerId) {
        return NextResponse.json({ 
            error: "File and customer ID are required"
        }, { status: 400 });
    }

    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        return NextResponse.json({
            error: "Invalid file type. Only .doc, .docx, and .pdf files are allowed."
        }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    public_id: fileName.split(".")[0],
                    folder: 'printify_uploads',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(buffer);
        });

        const result = uploadResult as any;

        await prisma.upload.create({
            data: {
                filename: file.name,
                fileData: result.secure_url,
                status: 'pending',
                customerId: customerId,
            }
        });

        return NextResponse.json({
            message: "File uploaded successfully",
            uploadId: result.public_id,
            fileData: result.secure_url,
            filename: file.name,
            status: "pending"
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ 
            error: "Failed to upload file"
        }, { status: 500 });
    }
}