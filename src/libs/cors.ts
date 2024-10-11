// src/libs/cors.ts
import { NextResponse, NextRequest } from 'next/server';

// Mengambil nilai dari variabel environment
const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || [];

export function checkCors(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  // Periksa apakah origin yang mengirim request termasuk dalam daftar yang diizinkan
  if (!allowedOrigins.includes(origin)) {
    return new NextResponse('CORS Policy: This origin is not allowed', { status: 403 });
  }

  return null; // Mengembalikan null jika origin diizinkan
}
