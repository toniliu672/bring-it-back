// src/utils/authUtils.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function isAuthenticated(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return !!token;
}

export async function isAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.role === 'ADMIN';
}

type RouteHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ...args: any[]) => {
    if (!(await isAuthenticated(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, ...args);
  };
}

export function withAdminAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ...args: any[]) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Tambahkan log ini untuk melihat token yang didapatkan dari request
    console.log('Token:', token);

    // Jika token tidak ada, beri tahu di log dan return 401
    if (!token) {
      console.log('No token found, access denied.');
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Jika peran pengguna bukan ADMIN, beri tahu di log dan return 403
    if (token.role !== 'ADMIN') {
      console.log('Access denied. User is not an admin. Role:', token.role);
      return new NextResponse(
        JSON.stringify({ message: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Access granted. Proceeding with the handler.');
    return handler(req, ...args);
  };
}