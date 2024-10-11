import { PrismaClient } from "@prisma/client";
import { RegisterData } from '@/interfaces/authInterface';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const AuthService = {
  login: async (email: string, password: string) => {
    // Implementasi login yang mengembalikan user jika berhasil
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  register: async (data: RegisterData) => {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};