"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function SessionCheck() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const expiryDate = new Date(session.expires);
      const checkSession = () => {
        if (expiryDate < new Date()) {
          alert("Your session has expired. Please log in again.");
          signOut({ callbackUrl: '/login' });
        }
      };

      const interval = setInterval(checkSession, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [session, router]);

  return null;
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={5 * 60}>
      <SessionCheck />
      {children}
    </NextAuthSessionProvider>
  );
}