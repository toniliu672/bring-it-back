import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      router.push('/peta');
      return true;
    } catch {
      setError('An unexpected error occurred');
      return false;
    }
  };

  const register = async ({ username, email, password, role }: { username: string; email: string; password: string; role: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Registration failed');
        return false;
      }

      router.push('/login?registered=true');
      return true;
    } catch {
      setError('An unexpected error occurred');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/login' });
      router.push('/login');
    } catch {
      setError('An error occurred during logout');
    }
  };

  return { login, register, logout, error };
}
