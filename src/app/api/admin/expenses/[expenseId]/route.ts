import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ expenseId: string }> }
) {
    const { expenseId } = await params;
    const expenseIdNum = Number(expenseId);

    if (isNaN(expenseIdNum)) {
        return NextResponse.json({
            error: "Invalid expense ID"
        }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { expenseName, amount, category, description, occuredAt } = body;

        if (!expenseName || !amount || !category || !description || !occuredAt) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: expenseIdNum },
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
    { params }: { params: Promise<{ expenseId: string }> }
) {
    const expenseId = Number((await params).expenseId);

    if (isNaN(expenseId)) {
        return NextResponse.json({
            error: "Invalid expense ID"
        }, { status: 400 });
    }

    try {
        const deletedExpense = await prisma.expense.findUnique({
            where: { id: expenseId },
        });

        if (!deletedExpense) {
            return NextResponse.json({
                error: "Expense not found"
            }, { status: 404 });
        }

        await prisma.expense.delete({
            where: { id: expenseId }
        });

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
