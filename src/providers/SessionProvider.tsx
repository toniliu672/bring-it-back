"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Daftar rute publik yang tidak memerlukan autentikasi
const publicRoutes = ['/login', '/register'];

function SessionCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const expiryDate = new Date(session.expires);

      // Check if the session is already expired
      if (expiryDate < new Date()) {
        alert("Your session has expired. Please log in again.");
        signOut({ callbackUrl: '/login' });
      }
    }

    // Jika statusnya 'unauthenticated' dan bukan rute publik, redirect ke halaman login.
    if (status === "unauthenticated" && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [status, session, router, pathname]);

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