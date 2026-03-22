import type { Metadata } from 'next';
import './globals.css';
import AppProviders from '@/providers/AppProviders';

export const metadata: Metadata = {
  title: 'FinTracker',
  description: 'Personal finance tracker',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
