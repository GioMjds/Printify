import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const month = parseInt(searchParams.get("month") || `${new Date().getMonth() + 1}`);
        const year = parseInt(searchParams.get("year") || `${new Date().getFullYear()}`);

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const uploads = await prisma.upload.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            }
        });

        const expenses = await prisma.expense.findMany({
            where: {
                occuredAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            orderBy: { occuredAt: 'asc' },
        })

        const totalOrders = uploads.length;
        const completedOrders = uploads.filter(u => u.status === "completed").length;
        const totalRevenue = uploads.reduce((sum, upload) => sum + (upload.needed_amount || 0), 0);

        const uploadsByStatus = [
            ...new Set(uploads.map(u => u.status))
        ].map(status => ({
            status,
            _count: { status: uploads.filter(u => u.status === status).length }
        }));

        return NextResponse.json({
            "month": month,
            "year": year,
            "totalOrders": totalOrders,
            "completedOrders": completedOrders,
            "totalRevenue": totalRevenue,
            "uploadsByStatus": uploadsByStatus,
            "expenses": expenses,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/admin GET error: ${error}`
        }, { status: 500 });
    }
}