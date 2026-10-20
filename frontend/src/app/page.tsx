'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getRolePermissions } from '@/lib/permissions';
import { useToast } from '@/context/ToastContext';
import { Employee, AttendanceRecord, TaskItem, LeaveRequest, DashboardStats } from '@/lib/types';
import {
  Users,
  Clock,
  CheckSquare,
  Banknote,
  CalendarDays,
  UserPlus,
  Plus,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  TrendingUp,
  MapPin,
  Laptop,
  Check,
  UserCheck,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const perms = getRolePermissions(user?.role);
  const { showToast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<TaskItem[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Action Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskItem['priority']>('High');
  const [taskDesc, setTaskDesc] = useState('');

  const loadData = async () => {
    try {
      const [s, att, t, l, emps] = await Promise.all([
        api.getDashboardStats(),
        api.getAttendance(),
        api.getTasks(),
        api.getLeaves(),
        api.getEmployees(),
      ]);
      setStats(s);
      if (user?.role === 'Employee') {
        const userAtt = att.filter(
          (r) =>
            (user?.employeeCode && r.employeeCode === user.employeeCode) ||
            (user?.name && r.employeeName.toLowerCase() === user.name.toLowerCase())
        );
        setRecentAttendance(userAtt.slice(0, 6));

        const userTasks = t.filter(
          (task) =>
            (user?.id && task.assigneeId === user.id) ||
            (user?.name && task.assigneeName.toLowerCase() === user.name.toLowerCase())
        );
        setUrgentTasks(userTasks.slice(0, 4));

        const userLeaves = l.filter(
          (leave) =>
            (user?.id && leave.employeeId === user.id) ||
            (user?.name && leave.employeeName.toLowerCase() === user.name.toLowerCase()) ||
            (user?.employeeCode && leave.employeeCode === user.employeeCode)
        );
        setPendingLeaves(userLeaves.filter((leave) => leave.status === 'Pending'));
      } else {
        setRecentAttendance(att.slice(0, 6));
        setUrgentTasks(t.filter((task) => task.priority === 'Urgent' || task.priority === 'High').slice(0, 4));
        setPendingLeaves(l.filter((leave) => leave.status === 'Pending'));
      }
      setEmployees(emps);
      if (emps.length > 0 && !taskAssigneeId) {
        setTaskAssigneeId(emps[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveLeave = async (id: string, empName: string) => {
    await api.updateLeaveStatus(id, 'Approved', 'Approved by Executive Management');
    showToast(`Leave application for ${empName} approved!`, 'success');
    loadData();
  };

  const handleRejectLeave = async (id: string, empName: string) => {
    await api.updateLeaveStatus(id, 'Rejected', 'Declined due to critical delivery sprint');
    showToast(`Leave application for ${empName} declined`, 'info');
    loadData();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const targetAssigneeId = perms.canAssignTasksToAll
      ? (taskAssigneeId || employees[0]?.id)
      : (user?.id || taskAssigneeId || employees[0]?.id);

    await api.createTask({
      title: taskTitle,
      description: taskDesc,
      assigneeId: targetAssigneeId,
      priority: taskPriority,
      status: 'Todo',
      progress: 0,
    });
    showToast(
      perms.canAssignTasksToAll
        ? `Task "${taskTitle}" assigned successfully`
        : `Task "${taskTitle}" logged to your board`,
      'success'
    );
    setTaskTitle('');
    setTaskDesc('');
    setIsTaskModalOpen(false);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header
        title="Executive HR Overview"
        subtitle="Pakistan Enterprise Headcount, Realtime Operations & Attendance"
        onClockAction={loadData}
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-7 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise HRM Active Node: Pakistan Region</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Assalam-o-Alaikum, {user?.name || 'Executive HR Team'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Operating across Lahore HQ, Karachi Regional Hub, and Islamabad Tech Centers.
                Today's attendance rate is{' '}
                <span className="text-emerald-400 font-bold font-mono">
                  {stats?.attendanceRate || 92}%
                </span>{' '}
                with PostgreSQL connection verified on port 5432.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {perms.canCreateEmployee && (
                <Link
                  href="/employees"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Employee</span>
                </Link>
              )}
              {user?.role === 'Employee' ? (
                <>
                  <Link
                    href="/leaves"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Apply for Leave</span>
                  </Link>
                  <Link
                    href="/payroll"
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/10 backdrop-blur-sm active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    <span>My Payslip</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/10 backdrop-blur-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Task</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Core Corporate Metric Cards */}
        {user?.role === 'Employee' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Duty Status"
              value="Duty Active"
              subtitle="Punctual check-in verified"
              change="08:55 AM PKT"
              isPositive={true}
              icon={UserCheck}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/40"
            />
            <StatCard
              title="My Assigned Deliverables"
              value={urgentTasks.length || 1}
              subtitle="Current sprint backlog"
              change="Active Task"
              isPositive={true}
              icon={CheckSquare}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-50 dark:bg-blue-950/40"
            />
            <StatCard
              title="My Pending Leaves"
              value={pendingLeaves.length}
              subtitle="Awaiting HR sign-off"
              change={pendingLeaves.length === 0 ? "All Clear" : "Pending"}
              isPositive={pendingLeaves.length === 0}
              icon={CalendarDays}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
            />
            <StatCard
              title="My Monthly Net Salary"
              value="₨ 253,000"
              subtitle="Credited to Bank Account"
              change="Disbursed"
              isPositive={true}
              icon={Banknote}
              iconColor="text-indigo-600 dark:text-indigo-400"
              iconBg="bg-indigo-50 dark:bg-indigo-950/40"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Headcount"
              value={stats?.totalEmployees || 12}
              subtitle="Verified Pakistani profiles"
              change="+2 this month"
              isPositive={true}
              icon={Users}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-50 dark:bg-blue-950/40"
            />
            <StatCard
              title="Today's Present"
              value={`${stats?.activeToday || 10} / ${stats?.totalEmployees || 12}`}
              subtitle={`${stats?.lateToday || 2} late clock-ins logged`}
              change={`${stats?.attendanceRate || 92}% on-time`}
              isPositive={true}
              icon={Clock}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/40"
            />
            <StatCard
              title="Pending Leaves"
              value={stats?.pendingLeaves || 2}
              subtitle="Awaiting management sign-off"
              change="Action Required"
              isPositive={false}
              icon={CalendarDays}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
            />
            <StatCard
              title="Monthly Payroll (PKR)"
              value={`₨ ${(stats?.monthlyPayrollPkr ? (stats.monthlyPayrollPkr / 1000000).toFixed(2) : '3.45')}M`}
              subtitle="Basic + allowances & tax deducted"
              change="FBR Compliant"
              isPositive={true}
              icon={Banknote}
              iconColor="text-indigo-600 dark:text-indigo-400"
              iconBg="bg-indigo-50 dark:bg-indigo-950/40"
            />
          </div>
        )}

        {/* Mid Section: Realtime Operations & Department Headcount */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Attendance Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  Today's Attendance Feed
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live biometric timestamps and workplace modes
                </p>
              </div>
              <Link
                href="/attendance"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {recentAttendance.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No attendance records logged for today yet. Use the Punch Clock button above to check in.
                </div>
              ) : (
                recentAttendance.map((rec) => (
                  <div key={rec.id} className="py-3.5 flex items-center justify-between gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs border border-blue-200 dark:border-blue-900/60 shrink-0">
                        {rec.employeeName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {rec.employeeName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {rec.department} &bull; <span className="font-mono">{rec.employeeCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-200">
                          In: {rec.clockIn}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                          {rec.workMode === 'Office' ? <Building2 className="w-3 h-3 text-slate-400" /> : <Laptop className="w-3 h-3 text-blue-400" />}
                          <span>{rec.workMode}</span>
                        </p>
                      </div>
                      <Badge status={rec.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Headcount Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 flex flex-col transition-colors">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                Department Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Talent allocation by corporate vertical
              </p>
            </div>

            <div className="mt-5 space-y-4 flex-1">
              {stats?.departmentDistribution &&
                Object.entries(stats.departmentDistribution).map(([dept, count]) => {
                  const total = stats.totalEmployees || 12;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={dept} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{dept}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 -mx-6 -mb-6 p-4 rounded-b-3xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>3 National Hubs (LHE, KHI, ISB)</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">100% Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Urgent Tasks & Leave Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Urgent / High Priority Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  Key Corporate Initiatives
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  High-priority milestones across engineering & finance
                </p>
              </div>
              <Link
                href="/tasks"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
              >
                <span>Kanban Board</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="mt-4 space-y-3.5">
              {urgentTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col gap-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t.title}
                    </h4>
                    <Badge status={t.priority} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <span>👤</span> {t.assigneeName} ({t.department})
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                      Due: {t.dueDate}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Leave Requests for Approval */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  Pending Leave Applications
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fast-track HR approval governance
                </p>
              </div>
              <Link
                href="/leaves"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
              >
                <span>All Leaves</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {pendingLeaves.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No pending leave applications. All clear!
                </div>
              ) : (
                pendingLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{leave.employeeName}</p>
                          <Badge status={leave.leaveType} />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {leave.department} &bull; {leave.startDate} to {leave.endDate} (
                          {leave.totalDays} days)
                        </p>
                      </div>
                      <Badge status={leave.status} />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{leave.reason}"
                    </p>

                    {perms.canApproveLeaves ? (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleRejectLeave(leave.id, leave.employeeName)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleApproveLeave(leave.id, leave.employeeName)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Leave</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end pt-1">
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting HR Approval
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quick Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Assign New Corporate Task"
        subtitle="Delegate deliverables with accountability and deadline tracking"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Conduct Security Audit on .NET API Gateway"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assignee
              </label>
              {perms.canAssignTasksToAll ? (
                <select
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.department})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                  {user?.name} (Self)
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide execution details, requirements, and reference links..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30"
            >
              Create & Assign Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
