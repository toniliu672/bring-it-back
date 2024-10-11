import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthService } from "@/services/authService";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use AuthService to register the user
    const newUser = await AuthService.register({
      username,
      email,
      password: hashedPassword,
      role: "USER"
    });

    if (!newUser) {
      return NextResponse.json({ error: "Gagal mendaftarkan pengguna" }, { status: 500 });
    }

    return NextResponse.json({ message: "Pendaftaran berhasil", user: { id: newUser.id, username: newUser.username, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Terjadi kesalahan saat pendaftaran: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan yang tidak diketahui saat pendaftaran" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}