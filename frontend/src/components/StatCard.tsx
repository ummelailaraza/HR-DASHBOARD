import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  iconBg = 'bg-blue-50 dark:bg-blue-950/40',
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-dark-card hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        {change && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
}
