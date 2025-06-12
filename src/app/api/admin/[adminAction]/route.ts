import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const adminAction = searchParams.get('action');

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