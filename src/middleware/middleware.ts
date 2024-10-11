import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { handleCORS } from './corsMiddleware';
import { handleAuth, isPublicRoute } from './authMiddleware';

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for path:", request.nextUrl.pathname);

  // Handle CORS first
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    console.log("CORS response returned");
    return corsResponse;
  }

  // Get the token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token present:", !!token);

  // Check if it's a public route
  if (isPublicRoute(request.nextUrl.pathname)) {
    console.log("Public route detected:", request.nextUrl.pathname);
    return NextResponse.next();
  }

  // Handle authentication
  const authResponse = await handleAuth(request, token);
  if (authResponse) {
    console.log("Auth response received, redirecting to:", authResponse.headers.get("Location"));
    return authResponse;
  }

  // If all checks pass, proceed with the request
  console.log("All checks passed, proceeding with request");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*"
  ],
};