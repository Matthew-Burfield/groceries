import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/meal-plans',
  '/shopping-lists',
  '/inventory',
  '/setup-family',
];

// Add routes that should redirect to dashboard if user is authenticated
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    // If token exists, redirect to dashboard
    // Note: We don't verify the token here since JWT verification
    // isn't supported in Edge Runtime. The token will be verified
    // in the auth API routes and server components.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/meal-plans/:path*',
    '/shopping-lists/:path*',
    '/inventory/:path*',
    '/setup-family/:path*',
    '/login',
    '/register',
  ],
}; 