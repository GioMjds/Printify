import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const adminAction = searchParams.get('action');
        const uploadId = searchParams.get('uploadId');

        switch (adminAction) {
            case 'fetch_print_orders': {
                const printOrders = await prisma.upload.findMany({
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        customer: true,
                    },
                });

                return NextResponse.json({ printOrders }, { status: 200 });
            }
            case 'download_file': {
                if (!uploadId) {
                    return NextResponse.json({ error: 'Missing uploadId' }, { status: 400 });
                }
                const upload = await prisma.upload.findUnique({ where: { id: uploadId } });
                if (!upload) {
                    return NextResponse.json({ error: 'File not found' }, { status: 404 });
                }
                const fileUrl = upload.fileData;
                let filename = upload.filename;
                const format = upload.format;
                // Ensure filename ends with the correct extension
                if (!filename.toLowerCase().endsWith(`.${format}`)) {
                    filename = filename.replace(/\.[^/.]+$/, '') + `.${format}`;
                }
                return new NextResponse(null, {
                    status: 302,
                    headers: {
                        Location: fileUrl + `?response-content-disposition=attachment;filename=\"${encodeURIComponent(filename)}\"`
                    }
                });
            }
            default: {
                return NextResponse.json({
                    error: "Invalid admin action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `An error occurred: ${error}`
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { adminAction } = body;

        switch (adminAction) {
            default: {
                return NextResponse.json({
                    error: "Invalid admin action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `An error occurred: ${error}`
        }, { status: 500 })
    }
}