import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'PakHRM Enterprise | Corporate HR & Operations Portal',
  description: 'Enterprise Human Resource Management Portal with PostgreSQL and .NET Integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans transition-colors duration-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
