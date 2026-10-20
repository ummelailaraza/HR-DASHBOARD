'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {isAuthPage ? (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
              {children}
            </div>
          ) : (
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
              </div>
            </div>
          )}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
