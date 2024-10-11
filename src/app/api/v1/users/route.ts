import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { withAdminAuth } from '@/utils/authUtils';
import { withCORS } from '@/utils/corsUtils'; // Import the CORS utility

const prisma = new PrismaClient();

export const GET = withCORS(
  withAdminAuth(async (req: NextRequest) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, role: true },
      });
      return NextResponse.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
  })
);

export const POST = withCORS(
  withAdminAuth(async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { username, email, password, role } = body;
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { 
          username, 
          email, 
          password: hashedPassword, 
          role 
        },
        select: { id: true, username: true, email: true, role: true },
      });
      
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
    }
  })
);
