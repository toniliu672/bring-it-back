import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { handleCORS } from './corsMiddleware';
import { handleAuth } from './authMiddleware';

export async function middleware(request: NextRequest) {
  // Handle CORS first
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  // Get the token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Handle authentication
  const authResponse = handleAuth(request, token);
  if (authResponse) return authResponse;

  // If all checks pass, proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*"
  ],
};