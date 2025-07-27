import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    params: Promise<{ expenseId: number }>
) {
    const { expenseId } = await params;
    try {
        const body = await req.json();
        const { expenseName, amount, category, description, occuredAt } = body;

        if (!expenseName || !amount || !category || !description || !occuredAt) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                expenseName,
                amount: parseFloat(amount),
                description,
                category,
                occuredAt: new Date(occuredAt),
            },
        });

        return NextResponse.json({
            message: "Expense updated successfully",
            expense: updatedExpense,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `Expenses API PUT error: ${error}`
        }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    params: Promise<{ expenseId: number }>
) {
    const { expenseId } = await params;
    try {
        const deletedExpense = await prisma.expense.delete({
            where: { id: expenseId },
        });

        if (!expenseId) {
            return NextResponse.json({
                error: "Expense not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Expense deleted successfully",
            expense: deletedExpense.id,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `Expenses API DELETE error: ${error}`
        }, { status: 500 });
    }
}
