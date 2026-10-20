'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getRolePermissions } from '@/lib/permissions';
import { LeaveRequest, Employee } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  HeartPulse,
  Sun,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function LeavesPage() {
  const { user } = useAuth();
  const perms = getRolePermissions(user?.role);
  const { addToast } = useToast();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Apply form state
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const loadLeaves = async () => {
    const [l, e] = await Promise.all([api.getLeaves(), api.getEmployees()]);
    setLeaves(l);
    setEmployees(e);
    if (e.length > 0 && !selectedEmpId) {
      if (!perms.canApplyForOthers && user) {
        const found = e.find(
          (emp) =>
            emp.employeeCode === user.employeeCode ||
            emp.fullName.toLowerCase() === user.name.toLowerCase()
        );
        setSelectedEmpId(found ? found.id : e[0].id);
      } else {
        setSelectedEmpId(e[0].id);
      }
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApprove = async (id: string, empName: string) => {
    await api.updateLeaveStatus(id, 'Approved', 'Approved by Head of People & Culture');
    addToast('success', 'Leave Approved', `Application for ${empName} was successfully approved.`);
    loadLeaves();
  };

  const handleReject = async (id: string, empName: string) => {
    await api.updateLeaveStatus(id, 'Rejected', 'Declined due to concurrent team leaves');
    addToast('info', 'Leave Declined', `Application for ${empName} was marked as declined.`);
    loadLeaves();
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const emp = employees.find((x) => x.id === selectedEmpId);

    await api.createLeave({
      employeeId: selectedEmpId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    addToast('success', 'Leave Submitted', `Leave for ${emp ? emp.fullName : 'employee'} submitted for review.`);
    setReason('');
    setIsApplyOpen(false);
    loadLeaves();
  };

  const personalLeaves = leaves.filter(
    (l) =>
      (user?.id && l.employeeId === user.id) ||
      (user?.name && l.employeeName.toLowerCase() === user.name.toLowerCase()) ||
      (user?.employeeCode && l.employeeCode === user.employeeCode)
  );

  const effectiveLeaves = perms.canViewAllLeaves ? leaves : personalLeaves;
  const filteredLeaves = effectiveLeaves.filter(
    (l) => statusFilter === 'All' || l.status === statusFilter
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header
        title={perms.canViewAllLeaves ? 'Leave Management & Governance' : 'My Leaves & Statutory Balance'}
        subtitle={
          perms.canViewAllLeaves
            ? 'Manage statutory annual, casual and medical leaves with approval governance'
            : 'Submit leave applications, track approval workflow and review statutory quotas'
        }
        onClockAction={loadLeaves}
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
        {/* Statutory Leave Policy Overview in Pakistan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Annual Paid Leave (Privilege)"
            value="14 Days / Year"
            subtitle="Encashable or carry forward up to 7 days"
            icon={Sun}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-50 dark:bg-amber-950/40"
          />
          <StatCard
            title="Casual Leave Quota"
            value="10 Days / Year"
            subtitle="For urgent personal & family requirements"
            icon={CalendarDays}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-50 dark:bg-blue-950/40"
          />
          <StatCard
            title="Medical / Sick Leave"
            value="08 Days / Year"
            subtitle="Full pay with licensed physician certificate"
            icon={HeartPulse}
            iconColor="text-rose-600 dark:text-rose-400"
            iconBg="bg-rose-50 dark:bg-rose-950/40"
          />
        </div>

        {/* Action and Filter Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending Sign-off</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Declined</option>
            </select>
          </div>

          <button
            onClick={() => setIsApplyOpen(true)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Leave Application</span>
          </button>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200/90 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4">Days</th>
                  <th className="py-3.5 px-6">Reason / Justification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">
                    {perms.canApproveLeaves ? 'Approval Actions' : 'Status / Review'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      No leave requests found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <p className="font-bold text-slate-900 dark:text-white">{leave.employeeName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {leave.employeeCode} &bull; {leave.department}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={leave.leaveType} />
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {leave.startDate} to {leave.endDate}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'}
                      </td>

                      <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 italic max-w-xs truncate">
                        "{leave.reason}"
                        {leave.managerComments && (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 not-italic mt-0.5">
                            Note: {leave.managerComments}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={leave.status} />
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        {leave.status === 'Pending' ? (
                          perms.canApproveLeaves ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReject(leave.id, leave.employeeName)}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                              <button
                                onClick={() => handleApprove(leave.id, leave.employeeName)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50">
                              Awaiting HR Approval
                            </span>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {leave.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Submit Leave Application"
        subtitle="Requests are routed to the department lead and recorded in PostgreSQL"
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Applying Employee</label>
            {perms.canApplyForOthers ? (
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.department} - {emp.employeeCode})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex items-center justify-between">
                <span>{user?.name || 'Current User'} ({user?.department} - {user?.employeeCode})</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/50">Self</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Leave Category</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Casual">Casual Leave (Personal / Urgent)</option>
              <option value="Annual">Annual Privilege Leave (Vacation)</option>
              <option value="Sick">Sick / Medical Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason & Backup Coverage</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="State purpose of leave and name of colleague covering operational responsibilities..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsApplyOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
