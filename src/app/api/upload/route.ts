import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

// Allowed file extensions
const allowedExtensions = ['.doc', '.docx', '.pdf'];

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const formData = await req.formData();
        const file = formData.get("file");
        
        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        const filename = file.name;
        const ext = path.extname(filename).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return NextResponse.json(
                { error: "Invalid file type. Only .doc, .docx, .pdf are accepted" },
                { status: 400 }
            );
        }

        const uploadId = randomUUID();
        const safeFilename = `${uploadId}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        await fs.mkdir(uploadDir, { recursive: true });
        
        const buffer = await file.arrayBuffer();
        await fs.writeFile(
            path.join(uploadDir, safeFilename),
            Buffer.from(buffer)
        );

        const url = `/uploads/${safeFilename}`;
        const upload = await prisma.upload.create({
            data: {
                id: uploadId,
                filename,
                url,
                customerId: session.userId,
            },
        });

        return NextResponse.json({ uploadId: upload.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}