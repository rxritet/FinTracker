'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/auth';

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    router.replace(token ? '/dashboard' : '/login');
  }, [hydrated, router, token]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Skeleton className="h-8 w-2/3" />
    </main>
  );
}
