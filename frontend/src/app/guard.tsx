'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const Guard = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth');
    } else {
      router.push('/');
    }
  }, [token, router]);

  if (!token) return null;
  return children;
};

export default Guard;
