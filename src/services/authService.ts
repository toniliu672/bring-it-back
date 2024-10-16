import { PrismaClient } from "@prisma/client";
import { RegisterData } from '@/interfaces/authInterface';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const AuthService = {
  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};