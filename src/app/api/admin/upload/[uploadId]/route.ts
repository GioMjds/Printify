import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({
            message: "This endpoint is not implemented yet."
        }, { status: 501 });
    } catch (error) {
        return NextResponse.json({
            error: `admin/upload/[uploadId] GET error: ${error}`
        }, { status: 500 });
    }
}