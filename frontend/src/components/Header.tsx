'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import Avatar from './Avatar';
import { api } from '@/lib/api';
import {
  Bell,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ShieldAlert,
  X,
  ExternalLink,
  Laptop,
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onClockAction?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'leave' | 'task' | 'attendance' | 'system';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Leave Request Approved',
    message: 'Hamza Farooq’s annual leave (Oct 14-18) was approved by Fatima Zahra.',
    time: '10 mins ago',
    read: false,
    type: 'leave',
  },
  {
    id: 'n-2',
    title: 'High Priority Task Assigned',
    message: 'Omer Saeed assigned to "Security Penetration Testing for .NET Endpoints".',
    time: '45 mins ago',
    read: false,
    type: 'task',
  },
  {
    id: 'n-3',
    title: 'Biometric Attendance Synchronized',
    message: 'Lahore HQ and Karachi Hub biometric logs synced with PostgreSQL.',
    time: '1 hour ago',
    read: false,
    type: 'attendance',
  },
  {
    id: 'n-4',
    title: 'FBR Tax SRO Updated',
    message: 'Withholding certificates ready for download under Section 149.',
    time: '2 hours ago',
    read: true,
    type: 'system',
  },
];

export default function Header({
  title = "HR Executive Overview",
  subtitle = "Pakistan Enterprise Operations & Headcount",
  onClockAction,
}: HeaderProps) {
  const router = useRouter();
  const { user, logout, switchUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [clockedIn, setClockedIn] = useState<boolean>(true);
  const [clockLoading, setClockLoading] = useState<boolean>(false);

  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Live PKT Time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-PK', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global click-outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClockToggle = async () => {
    setClockLoading(true);
    try {
      await api.clockInOutQuick(user?.id || 'emp-1', 'Office');
      setClockedIn(!clockedIn);
      const msg = clockedIn
        ? `Checked out successfully for ${user?.name || 'Staff'}`
        : `Punched In: Marked Present at ${user?.city || 'Karachi'} Hub (${currentTime})`;
      showToast(msg, 'success');
      if (onClockAction) onClockAction();
    } catch (e) {
      showToast('Error syncing biometric clock. Logged locally.', 'warning');
    } finally {
      setClockLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-colors duration-200">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>
      </div>

      {/* Action Controls & Widgets */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search portal...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-semibold">
            Ctrl K
          </kbd>
        </button>

        {/* Live Pakistan Standard Time Widget */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin-slow" />
          <span className="font-mono text-slate-900 dark:text-white font-bold">{currentTime || '10:25:00 AM'}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">PKT</span>
        </div>

        {/* Quick Punch In/Out button */}
        <button
          onClick={handleClockToggle}
          disabled={clockLoading}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
            clockedIn
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/25 active:scale-95'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              clockedIn ? 'bg-amber-500 animate-pulse' : 'bg-white'
            }`}
          />
          <span className="hidden sm:inline">
            {clockLoading ? 'Syncing...' : clockedIn ? 'Clock Out (Office)' : 'Clock In (Office)'}
          </span>
          <span className="sm:hidden">{clockedIn ? 'Clock Out' : 'Clock In'}</span>
        </button>

        {/* Dark Mode / Light Mode Toggle Button */}
        <button
          onClick={() => {
            toggleTheme();
            showToast(`Theme switched to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, 'info');
          }}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600 animate-fade-in" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all shadow-sm relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-slide-down">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`py-3 px-2 rounded-xl transition-colors ${
                      n.read
                        ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        : 'bg-blue-50/50 dark:bg-blue-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="relative">
              <Avatar
                src={user?.avatar}
                name={user?.name || 'Ummelaila Raza'}
                gender={user?.gender}
                size="sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name || 'Ummelaila Raza'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {user?.role || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-slide-down">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Avatar
                  src={user?.avatar}
                  name={user?.name || 'Ummelaila Raza'}
                  gender={user?.gender}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {user?.role} &bull; {user?.city}
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher */}
              <div className="py-2.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Switch Active Role (Demo)
                </p>
                <div className="space-y-1">
                  {DEMO_USERS.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        switchUser(demo);
                        setIsProfileOpen(false);
                        showToast(`Switched account to ${demo.name}`, 'info');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        user?.id === demo.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{demo.name}</span>
                      <span className="text-[10px] opacity-70">{demo.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout Option */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                    showToast('Logged out of session', 'info');
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Quick Search Modal (Ctrl + K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search employees, tasks, departments, leaves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase px-2">
                Quick Navigation
              </div>
              {user?.role !== 'Employee' && (
                <Link
                  href="/employees"
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span>👥 Employee Directory</span>
                  <span className="text-[10px] text-slate-400">12 records</span>
                </Link>
              )}
              <Link
                href="/attendance"
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span>⏰ Attendance Ledger & Biometrics</span>
                <span className="text-[10px] text-slate-400">Live logs</span>
              </Link>
              <Link
                href="/tasks"
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span>📋 Kanban Tasks Board</span>
                <span className="text-[10px] text-slate-400">6 tasks</span>
              </Link>
              <Link
                href="/leaves"
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span>🏖️ Leave Applications & Approval</span>
                <span className="text-[10px] text-slate-400">2 pending</span>
              </Link>
              <Link
                href="/payroll"
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span>💰 Payroll & FBR Withholding</span>
                <span className="text-[10px] text-slate-400">₨ 3.45M</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
