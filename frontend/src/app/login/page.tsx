'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import Avatar from '@/components/Avatar';
import {
  Lock,
  Mail,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  UserCheck,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'credentials' | 'demo'>('credentials');
  const [email, setEmail] = useState('ummelaila.raza@corporate.pk');
  const [password, setPassword] = useState('Admin@1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // smooth micro-interaction
    await login(email, password);
    setLoading(false);
    showToast(`Welcome back, ${email.split('@')[0]}! Signed in successfully.`, 'success');
    router.push('/');
  };

  const handleSelectDemo = (userPreset: typeof DEMO_USERS[0]) => {
    switchUser(userPreset);
    showToast(`Signed in as ${userPreset.name} (${userPreset.role})`, 'success');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:scale-105 active:scale-95 transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 font-extrabold text-2xl tracking-wider">
            PK
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            PakHRM Enterprise
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Corporate HR & Operations Portal • Pakistan Region
          </p>
        </div>

        {/* Main Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 shadow-xl dark:shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Corporate Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Accounts</span>
            </button>
          </div>

          {activeTab === 'credentials' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@corporate.pk"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Default demo password is: Admin@1234', 'info')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Remember session</span>
                </label>
                <span className="text-[11px] text-slate-400">PostgreSQL Verified</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Click any pre-configured executive or departmental profile to immediately access the portal:
              </p>
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => handleSelectDemo(demo)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={demo.avatar}
                      name={demo.name}
                      gender={demo.gender}
                      size="md"
                      showGenderBadge={true}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {demo.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {demo.role} &bull; {demo.city} &bull; <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{demo.gender}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Switch
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Footer Register Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New team member onboarding?{' '}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Create Corporate Account</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Security watermark */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>PostgreSQL TLS &bull; FBR Tax Compliant &bull; .NET 8 Web API</span>
        </div>
      </div>
    </div>
  );
}
