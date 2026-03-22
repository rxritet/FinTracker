'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/transactions', label: 'Transactions' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Wallet className="h-5 w-5 text-brand-600" />
          FinTracker
        </Link>
        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm ${active ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          onClick={() => {
            clearToken();
            router.replace('/login');
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
