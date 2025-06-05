import { NextResponse, NextRequest } from "next/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: "Hello Next.js" }, { status: 200 });
}