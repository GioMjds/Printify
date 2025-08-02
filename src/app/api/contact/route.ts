import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { contactUsEmail } from "@/utils/send-email";

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({
                error: "All fields are required.",
            }, { status: 400 });
        }

        await contactUsEmail(name, email, subject, message);

        return NextResponse.json({
            message: "Contact form submitted successfully.",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/contact POST error: ${error}`,
        }, { status: 500 })
    }
};