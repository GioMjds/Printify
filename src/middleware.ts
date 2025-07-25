import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const accessToken = req.cookies.get("access_token")?.value;

    const landingRoutes = [
        "/", "/profile", "/upload", "/my-orders"
    ];

    const isLandingRoute =
        landingRoutes.includes(pathname) ||
        pathname.startsWith("/profile/") ||
        pathname.startsWith("/upload/") ||
        pathname.startsWith("/my-orders/");

    if (isLandingRoute && accessToken) {
        try {
            const { payload } = await jwtVerify(accessToken, encodedKey, { algorithms: ["HS256"] });
            const role = payload.role;
            if (role === "admin") {
                return NextResponse.redirect(new URL("/admin", req.url), { status: 302 });
            }
            if (role === "staff") {
                return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 302 });
            }
        } catch {
            return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
        }
    }

    if (pathname === "/") {
        if (accessToken) {
            try {
                const { payload } = await jwtVerify(accessToken, encodedKey, { algorithms: ["HS256"] });
                const role = payload.role;
                if (role === "staff") {
                    return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 302 });
                }
                if (role === "admin") {
                    return NextResponse.redirect(new URL("/admin", req.url), { status: 302 });
                }
            } catch {
                return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
            }
        }
    }

    if (pathname.startsWith("/admin")) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
        }
        try {
            const { payload } = await jwtVerify(accessToken, encodedKey, { algorithms: ["HS256"] });
            const role = payload.role;

            // Only allow staff to access /admin/orders, not other /admin routes
            if (role === "staff") {
                if (pathname !== "/admin/orders" && !pathname.startsWith("/admin/orders/")) {
                    return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 302 });
                }
            }

            // Only allow admin to access all /admin routes
            if (role !== "admin" && role !== "staff") {
                return NextResponse.redirect(new URL("/", req.url), { status: 302 });
            }
        } catch {
            return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/login",
        "/register",
        "/forgot",
        "/verify"
    ]
}