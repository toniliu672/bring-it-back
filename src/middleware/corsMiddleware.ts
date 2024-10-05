import { NextRequest, NextResponse } from 'next/server';

export function handleCORS(request: NextRequest): NextResponse | undefined {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const response = NextResponse.next();
    
    // restrict this to specific origins in production
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
      return response;
    }

    return response;
  }
}