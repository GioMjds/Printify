import prisma from "@/lib/prisma";
import type { UploadApiResponse } from 'cloudinary';
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const allowedExtensions = ['.pdf', '.doc', '.docx'];
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const config = {
    api: { bodyParser: false }
}

export async function POST(req: NextRequest) {
    const contentType: string | null = req.headers.get("Content-Type");

    if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return NextResponse.json({ 
            error: 'Content-Type must be "multipart/form-data".' 
        }, { status: 415 });
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
    const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    const isValidFileExtension = !allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.type)

    if (isValidFileExtension) {
        return NextResponse.json({
            error: "Invalid file type. Only PDF and Word documents are allowed."
        }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                resource_type: 'raw',
                public_id: fileName.replace(/\.[^/.]+$/, ""),
                folder: 'printify_uploads',
                use_filename: true,
                unique_filename: false,
                context: `extension=${fileExtension}|customerId=${customerId}`,
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse);
            });
            stream.end(buffer);
        });

        await prisma.upload.create({
            data: {
                filename: file.name,
                fileData: uploadResult.secure_url,
                status: 'pending',
                customerId,
                format: fileExtension.replace('.', ''),
            }
        });

        return NextResponse.json({
            message: "File uploaded successfully",
            uploadId: uploadResult.public_id,
            fileData: uploadResult.secure_url,
            filename: file.name,
            customerId,
            format: fileExtension.replace('.', ''),
            status: "pending"
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            error: `File upload failed: ${error}`
        }, { status: 500 })
    }
}
