// src/app/api/v1/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { withAdminAuth } from '@/utils/authUtils';
import { withCORS } from '@/utils/corsUtils';

const prisma = new PrismaClient();

export const PUT = withCORS(withAdminAuth(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = Number(params.id);

  try {
    const body = await req.json();
    const { username, email, password, role } = body;
    
    const updateData: {
      username?: string;
      email?: string;
      role?: "ADMIN" | "USER";
      password?: string;
    } = { username, email, role };
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, email: true, role: true },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}));

export const DELETE = withCORS(withAdminAuth(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = Number(params.id);

  try {
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}));
