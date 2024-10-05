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
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use AuthService to register the user
    const user = await AuthService.register({
      username,
      email,
      password: hashedPassword,
      role: "USER"
    });

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}