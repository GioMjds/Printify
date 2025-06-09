import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    return NextResponse.json({
        user: await prisma.user.findFirst({
            where: {
                role: "customer"
            }
        })
    }, { status: 200 });
}