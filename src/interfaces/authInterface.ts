import { Prisma } from "@prisma/client";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: Prisma.UserCreateInput["role"];
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
}
