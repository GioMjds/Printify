import { createSession, getSessionCookiesToDelete } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { otpStorage } from "@/utils/otpCache";
import { sendOtpEmail, sendPassswordResetEmail } from "@/utils/send-email";
import { compare, hash } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

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
                    message: `${user.role} logged in successfully!`,
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
            case "send_register_otp": {
                const { firstName, lastName, email, password, confirmPassword } = body;

                if (!firstName || !lastName) {
                    return NextResponse.json({
                        error: "First name and last name are required"
                    }, { status: 400 });
                }

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

                otpStorage.set(firstName, lastName, email, otp, hashedPassword);

                await sendOtpEmail(email, otp);

                return NextResponse.json({
                    message: "OTP sent to your email",
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    otp: otp
                }, { status: 200 });
            }
            case "resend_otp": {
                const { firstName, lastName, email } = body;
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

                otpStorage.set(firstName, lastName, email, newOtp, otpData.hashedPassword);

                await sendOtpEmail(email, newOtp);

                return NextResponse.json({
                    message: "OTP resent to your email",
                    email: email,
                }, { status: 200 });
            }
            case "verify_otp": {
                const { email, otp } = body;

                const validation = otpStorage.validate(email, otp);
                
                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                const hashedPassword = validation.data?.hashedPassword;
                const firstName = validation.data?.firstName;
                const lastName = validation.data?.lastName;
                
                if (!hashedPassword) {
                    return NextResponse.json({
                        error: "No hashed password found for this email"
                    }, { status: 400 });
                }

                let profileImageUrl;

                try {
                    const defaultImagePath = path.join(
                        process.cwd(),
                        "public",
                        "Default_pfp.jpg",
                    );
                    const imageBuffer = fs.readFileSync(defaultImagePath);
                    const base64Items = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

                    const uploadResponse = await cloudinary.uploader.upload(
                        base64Items,
                        {
                            folder: "printify/profiles",
                            public_id: `user-${email.replace(/[@.]/g, "-")}`,
                            overwrite: true,
                            resource_type: "image",
                        },
                    )

                    profileImageUrl = uploadResponse.secure_url;
                } catch (CloudinaryError) {
                    console.error(`Error uploading profile image: ${CloudinaryError}`);
                }

                const newUser = await prisma.user.create({
                    data: {
                        id: crypto.randomUUID(),
                        name: `${firstName} ${lastName}`,
                        email: email,
                        password: hashedPassword,
                        profile_image: profileImageUrl,
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
                        name: newUser.name,
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
            case "forgot_password_send_otp": {
                const { email } = body;
                if (!email) {
                    return NextResponse.json({ error: "Email is required" }, { status: 400 });
                }
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    return NextResponse.json({ error: "User does not exist" }, { status: 404 });
                }
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                otpStorage.set("", "", email, otp, user.password!); // Store OTP with current password for verification
                await sendPassswordResetEmail(email, otp);
                return NextResponse.json({ message: "OTP sent to your email" }, { status: 200 });
            }
            case "forgot_password_verify_otp": {
                const { email, otp } = body;
                if (!email || !otp) {
                    return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
                }
                const validation = otpStorage.validate(email, otp);
                if (!validation.valid) {
                    return NextResponse.json({ error: validation.error }, { status: 400 });
                }
                return NextResponse.json({ message: "OTP verified" }, { status: 200 });
            }
            case "forgot_password_reset_password": {
                const { email, otp, newPassword } = body;
                if (!email || !otp || !newPassword) {
                    return NextResponse.json({ 
                        error: "Email, OTP, and new password are required"
                    }, { status: 400 });
                }

                const validation = otpStorage.validate(email, otp);
                if (!validation.valid) {
                    return NextResponse.json({ 
                        error: validation.error
                    }, { status: 400 });
                }

                const hashedPassword = await hash(newPassword, 12);
                await prisma.user.update({ 
                    where: { email }, 
                    data: { password: hashedPassword } 
                });
                
                otpStorage.delete(email);

                return NextResponse.json({ 
                    message: "Password reset successful"
                }, { status: 200 });
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