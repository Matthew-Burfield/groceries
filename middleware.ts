import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/meal-plans",
  "/shopping-lists",
  "/inventory",
  "/setup-family",
];

// Add routes that should redirect to dashboard if user is authenticated
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // For protected routes, only redirect to login if there's no token
  // Let the server components handle invalid tokens
  if (isProtectedRoute && !token) {
    console.log("middleware", { isProtectedRoute, token });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For auth routes, only redirect to dashboard if there's a token
  // Let the server components handle invalid tokens
  if (isAuthRoute && token) {
    console.log("middleware", { isAuthRoute, token });
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meal-plans/:path*",
    "/shopping-lists/:path*",
    "/inventory/:path*",
    "/setup-family/:path*",
    "/login",
    "/register",
  ],
};

