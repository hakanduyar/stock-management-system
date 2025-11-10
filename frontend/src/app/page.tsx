'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/shared/Loading';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/products');
    } else {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return <Loading />;
}