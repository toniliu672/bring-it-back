import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

const protectedApiRoutes = {
  "/api/v1/schools": ["POST", "PUT", "DELETE"],
  "/api/v1/occupations": ["POST", "PUT", "DELETE"],
  "/api/v1/competencyUnits": ["POST", "PUT", "DELETE"],
};

const adminOnlyRoutes = ["/api/v1/users"];

export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth",
    "/peta",
    "/api-docs",
    "/(with-navbar)/(auth)/register",
    "/(auth)/register"
  ];
  return publicRoutes.some(route => pathname.endsWith(route) || pathname.includes(`${route}/`));
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

export async function handleAuth(request: NextRequest, token: JWT | null): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const method = request.method;

  console.log(`Accessing path: ${pathname}`); // Log untuk debugging
  console.log(`Is public route: ${isPublicRoute(pathname)}`); // Log untuk debugging

  // Handle authentication for protected API routes
  if (isProtectedApiRoute(pathname, method) || isAdminOnlyRoute(pathname)) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Autentikasi diperlukan' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Check for ADMIN role on admin-only routes
    if (isAdminOnlyRoute(pathname) && token.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Akses admin diperlukan' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // Handle authentication for non-API routes
  if (!isPublicRoute(pathname) && !token) {
    console.log("Redirecting to login page"); // Log untuk debugging
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from login and register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    console.log("User is already logged in, redirecting to home"); // Log untuk debugging
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("Proceeding with the request"); // Log untuk debugging
  return NextResponse.next();
}