import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionData extends JWTPayload {
    userId: string;
    role: string;
    email: string;
}

export async function encrypt(payload: Record<string, unknown>): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(encodedKey);
}

export async function decrypt(token: string) {
    const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function createSession(userId: string, role: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, role: true },
        });

        if (!user) throw new Error("User not found");

        const sessionData: SessionData = {
            userId,
            role: role,
            email: user.email!,
        };

        const accessToken = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(encodedKey);

        const refreshToken = await new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(encodedKey);

        return { sessionData, accessToken, refreshToken };
    } catch (error) {
        console.error(`Error creating session: ${error}`);
        return null;
    }
}

export async function verifyToken(token: string) {
    return jwtVerify(token, encodedKey);
}

export async function getSessionCookiesToDelete() {
    return ["access_token", "refresh_token"];
}

export async function getSession(): Promise<SessionData | null> {
    try {
        const token = (await cookies()).get("access_token")?.value;
        if (!token) return null;

        try {
            const verified = await jwtVerify(token, encodedKey);
            return verified.payload as SessionData;
        } catch {
            return null;
        }
    } catch (error: any) {
        console.error(`Error getting session: ${error}`);
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                profile_image: true,
            },
        });

        return user;
    } catch (error) {
        console.error(`Error getting current user: ${error}`);
        return null;
    }
}

// Server-side authentication validation for API endpoints
export async function validateAdminSession(): Promise<NextResponse | null> {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json({
                error: "Unauthorized - Admin Access needed"
            }, { status: 401 });
        }

        if (session.role !== 'admin') {
            return NextResponse.json({
                error: "Forbidden - Admin access required"
            }, { status: 403 });
        }

        return null;
    } catch (error) {
        return NextResponse.json({
            error: `Internal Server Error - ${error}`
        }, { status: 500 });
    }
}

// Server-side general session validation for any protected route
export async function validateSession(): Promise<NextResponse | null> {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json({
                error: "Unauthorized - No session found",
            }, { status: 401 });
        }

        return null;
    } catch (error) {
        console.error(`Error validating session: ${error}`);
        return NextResponse.json({
            error: "Internal server error during authentication",
        }, { status: 500 });
    }
}