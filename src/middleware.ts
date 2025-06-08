import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

const PROTECTED_PATHS = [
    "/admin",
    "/admin/analytics",
    "/admin/orders",
    "/admin/settings",
    "/admin/users",
    "/customer",
    "/customer/orders",
    "/customer/profile",
    "/customer/new"
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const accessToken = req.cookies.get("access_token")?.value;

    if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        try {
            const { payload } = await jwtVerify(accessToken, encodedKey, { algorithms: ["HS256"] });
            const role = payload.role;

            if (pathname.startsWith("/admin") && role !== "admin") {
                return NextResponse.redirect(new URL("/customer", req.url));
            }

            if (pathname.startsWith("/customer") && role !== "customer") {
                return NextResponse.redirect(new URL("/admin", req.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/login",
        "/register",
        "/forgot-password",
        "/verify"
    ]
}