import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all expenses
export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({
            "message": "Expenses fetched successfully",
            "expenses": expenses,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `Expenses API GET error: ${error}`
        }, { status: 500 });
    }
}

// Adding new expense
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { expenseName, amount, category, description, occuredAt } = body;

        if (!expenseName || !amount || !category || !occuredAt) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        const newExpense = await prisma.expense.create({
            data: {
                expenseName: expenseName,
                amount: parseFloat(amount),
                description: description,
                category: category,
                occuredAt: new Date(occuredAt),
            },
        });

        return NextResponse.json({
            message: "Expense added successfully",
            expense: {
                id: newExpense.id,
                expenseName: newExpense.expenseName,
                amount: newExpense.amount,
                description: newExpense.description,
                category: newExpense.category,
                occuredAt: newExpense.occuredAt,
            },
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            error: `Expenses API POST error: ${error}`
        }, { status: 500 });
    }
}