import { createSession, getSessionCookiesToDelete } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { otpStorage } from "@/utils/otpCache";
import { sendOtpEmail } from "@/utils/send-email";
import { compare, hash } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        switch (action) {
            case "logout": {
                const sessionId = req.cookies.get("access_token")?.value;
                if (!sessionId) {
                    return NextResponse.json({
                        error: "No session found"
                    }, { status: 401 });
                }

                const response = NextResponse.json({
                    message: "Logged out successfully!"
                }, { status: 200 });

                const cookiesToDelete = await getSessionCookiesToDelete();
                for (const cookie of cookiesToDelete) {
                    response.cookies.delete(cookie);
                }

                return response;
            }
            case "login": {
                const { email, password } = body;

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!email || !password) {
                    return NextResponse.json({
                        error: "Email and password are required"
                    }, { status: 400 });
                }

                if (!user) {
                    return NextResponse.json({
                        error: "User does not exist"
                    }, { status: 404 });
                }

                const isPasswordValid = await compare(password, user.password!);

                if (!isPasswordValid) {
                    return NextResponse.json({
                        error: "Invalid password"
                    }, { status: 401 });
                }

                const session = await createSession(user.id, user.role!);

                if (!session) {
                    return NextResponse.json({
                        error: "Failed to create session"
                    }, { status: 500 });
                }

                const response = NextResponse.json({
                    message: "Customer login successful",
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                }, { status: 200 });

                response.cookies.set({
                    name: "access_token",
                    value: session.accessToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24, // 1 day
                    path: "/",
                    sameSite: "strict",
                });

                response.cookies.set({
                    name: "refresh_token",
                    value: session.refreshToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                    sameSite: "strict",
                });

                return response;
            }
            // For register/page.tsx -> register credential. If success,
            // send OTP to email for verification.
            case "send_register_otp": {
                // This endpoint is for register/page.tsx
                const { email, password, confirmPassword } = body;

                if (!email || !password || !confirmPassword) {
                    return NextResponse.json({
                        error: "Email, password, and confirm password are required"
                    }, { status: 400 });
                }

                if (!email) {
                    return NextResponse.json({
                        error: "Email is required"
                    }, { status: 400 });
                }

                if (password !== confirmPassword) {
                    return NextResponse.json({
                        error: "Passwords do not match"
                    }, { status: 400 });
                }

                const existingUser = await prisma.user.findUnique({
                    where: { email }
                });

                if (existingUser) {
                    return NextResponse.json({
                        error: "User already exists"
                    }, { status: 400 });
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const hashedPassword = await hash(password, 12);

                otpStorage.set(email, otp, hashedPassword);

                await sendOtpEmail(email, otp);

                return NextResponse.json({
                    message: "OTP sent to your email",
                    email: email,
                    otp: otp // For testing purposes, remove in production
                }, { status: 200 });
            }
            // For resend OTP in verify/page.tsx
            case "resend_otp": {
                const { email } = body;
                if (!email) {
                    return NextResponse.json({
                        error: "Email is required"
                    }, { status: 400 });
                }

                // Check if OTP exists for this email
                const otpData = otpStorage.get(email);
                if (!otpData) {
                    return NextResponse.json({
                        error: "No OTP request found for this email. Please register first."
                    }, { status: 404 });
                }

                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

                otpStorage.set(email, newOtp, otpData.hashedPassword);

                await sendOtpEmail(email, newOtp);

                return NextResponse.json({
                    message: "OTP resent to your email",
                    email: email,
                    otp: newOtp // For testing purposes, remove in production
                }, { status: 200 });
            }
            // verify/page.tsx -> verify OTP
            case "verify_otp": {
                const { email, otp } = body;

                const validation = otpStorage.validate(email, otp);
                
                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                const hashedPassword = validation.data?.hashedPassword;
                if (!hashedPassword) {
                    return NextResponse.json({
                        error: "No hashed password found for this email"
                    }, { status: 400 });
                }

                const newUser = await prisma.user.create({
                    data: {
                        id: crypto.randomUUID(),
                        email: email,
                        password: hashedPassword,
                        role: "customer",
                    }
                });

                otpStorage.delete(email);
                const session = await createSession(newUser.id, newUser.role!);

                if (!session) {
                    return NextResponse.json({
                        error: "Failed to create session"
                    }, { status: 500 });
                }

                const response = NextResponse.json({
                    message: "User registered successfully!",
                    user: {
                        id: newUser.id,
                        name: "Guest",
                        email: newUser.email,
                        role: newUser.role
                    }
                }, { status: 201 });

                response.cookies.set({
                    name: "access_token",
                    value: session.accessToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24, // 1 day
                    path: "/",
                    sameSite: "strict",
                });

                response.cookies.set({
                    name: "refresh_token",
                    value: session.refreshToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                    sameSite: "strict",
                });

                return response;
            }
            default: {
                return NextResponse.json({
                    error: "Invalid action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `API Error: ${error}`
        }, { status: 500 });
    }
}