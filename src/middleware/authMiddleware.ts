import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

const publicRoutes = ["/login", "/register", "/api/auth", "/peta", "/api-docs"];

const protectedApiRoutes = {
  "/api/v1/schools": ["POST", "PUT", "DELETE"],
  "/api/v1/occupations": ["POST", "PUT", "DELETE"],
  "/api/v1/competencyUnits": ["POST", "PUT", "DELETE"],
};

const adminOnlyRoutes = ["/api/v1/users"];

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

export function isProtectedApiRoute(pathname: string, method: string): boolean {
  for (const [route, methods] of Object.entries(protectedApiRoutes)) {
    if (pathname.startsWith(route) && methods.includes(method)) {
      return true;
    }
  }
  return false;
}

export function isAdminOnlyRoute(pathname: string): boolean {
  return adminOnlyRoutes.some(route => pathname.startsWith(route));
}

export async function handleAuth(request: NextRequest, token: JWT | null): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Handle authentication for protected API routes
  if (isProtectedApiRoute(pathname, method) || isAdminOnlyRoute(pathname)) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Check for ADMIN role on admin-only routes
    if (isAdminOnlyRoute(pathname) && token.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Admin access required' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // Handle authentication for non-API routes
  if (!token && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}