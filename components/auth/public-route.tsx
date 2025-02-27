'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth-context';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state: authState } = useAuth();

  useEffect(() => {
    if (authState.user) {
      router.push('/dashboard');
    }
  }, [authState.user, router]);

  if (authState.user) {
    return null;
  }

  return <>{children}</>;
}