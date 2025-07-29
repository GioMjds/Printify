import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json({ user: session });
    } catch (error) {
        return NextResponse.json({ 
            user: null,
            error: `Session API GET error: ${error}` 
        }, { status: 401 });
    }
}
