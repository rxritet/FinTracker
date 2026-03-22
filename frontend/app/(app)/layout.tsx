'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Skeleton from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/auth';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace('/login');
    }
  }, [hydrated, router, token]);

  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-10 w-full" />
      </main>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
