import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    if (pathname.startsWith('/api/auth/') || 
        pathname === '/login' || 
        pathname === '/register') {
        return NextResponse.next();
    }
    
    const accessToken = req.cookies.get("access_token")?.value;
    
    let userRole: string | null = null;
    let isAuthenticated = false;

    if (accessToken) {
        try {
            const nextAuthToken = await getToken({ 
                req, 
                secret: process.env.NEXTAUTH_SECRET,
                cookieName: "access_token"
            });
            
            if (nextAuthToken) {
                userRole = nextAuthToken.role as string;
                isAuthenticated = true;
            }
        } catch {
            // Not a NextAuth token, try custom JWT validation
            try {
                const { payload } = await jwtVerify(accessToken, encodedKey, { algorithms: ["HS256"] });
                userRole = payload.role as string;
                isAuthenticated = true;
            } catch {
                // Invalid token
            }
        }
    }

    const landingRoutes = [
        "/", "/profile", "/upload", "/my-orders"
    ];

    const isLandingRoute =
        landingRoutes.includes(pathname) ||
        pathname.startsWith("/profile/") ||
        pathname.startsWith("/upload/") ||
        pathname.startsWith("/my-orders/");

    if (isLandingRoute && isAuthenticated) {
        if (userRole === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url), { status: 302 });
        }
        if (userRole === "staff") {
            return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 302 });
        }
    }

    if (pathname === "/") {
        if (isAuthenticated) {
            if (userRole === "staff") {
                return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 302 });
            }
            if (userRole === "admin") {
                return NextResponse.redirect(new URL("/admin", req.url), { status: 302 });
            }
        }
    }

    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
        }
        
        if (userRole === "staff") {
            if (pathname !== "/admin/orders" && !pathname.startsWith("/admin/orders/")) {
                return NextResponse.redirect(new URL("/admin/orders", req.url), { status: 302 });
            }
        }

        if (userRole !== "admin" && userRole !== "staff") {
            return NextResponse.redirect(new URL("/", req.url), { status: 302 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ]
}