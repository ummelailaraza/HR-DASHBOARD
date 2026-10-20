'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Avatar from './Avatar';
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckSquare,
  CalendarDays,
  Banknote,
  ShieldCheck,
  Building2,
  ChevronRight,
  Sparkles,
  LogIn,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { href: '/employees', label: 'Employee Directory', icon: Users, badge: '12' },
  { href: '/attendance', label: 'Attendance Tracking', icon: Clock },
  { href: '/tasks', label: 'Task Assignment', icon: CheckSquare, badge: '4 New' },
  { href: '/leaves', label: 'Leave Management', icon: CalendarDays, badge: '2' },
  { href: '/payroll', label: 'Payroll & Compensation', icon: Banknote },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 font-bold text-lg tracking-wider group-hover:scale-105 transition-transform">
            PK
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              <span>PakHRM Enterprise</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Corporate HR Suite</p>
          </div>
        </Link>
      </div>

      {/* Corporate Node Info */}
      <div className="mx-4 mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">PostgreSQL: hrm_db</span>
        </div>
        <span className="text-[10px] text-blue-400 font-mono bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/40">
          .NET 8
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Main Navigation
        </div>
        {NAV_ITEMS.filter((item) => {
          if (item.href === '/employees' && user?.role === 'Employee') {
            return false;
          }
          return true;
        }).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          // Contextual label for employee role
          let displayLabel = item.label;
          if (user?.role === 'Employee') {
            if (item.href === '/payroll') displayLabel = 'My Payroll & Payslip';
            if (item.href === '/attendance') displayLabel = 'My Attendance';
            if (item.href === '/leaves') displayLabel = 'My Leaves';
            if (item.href === '/tasks') displayLabel = 'My Assigned Tasks';
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span>{displayLabel}</span>
              </div>
              {item.badge && user?.role !== 'Employee' && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-700/80 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Current User Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                src={user.avatar}
                name={user.name}
                gender={user.gender}
                size="sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.role} ({user.city})
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Account</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
