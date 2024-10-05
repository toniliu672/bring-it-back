import NextAuth from "next-auth";
import { authOptions } from "@/libs/auth";

export const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };