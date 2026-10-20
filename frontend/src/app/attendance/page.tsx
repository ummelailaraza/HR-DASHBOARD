'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getRolePermissions } from '@/lib/permissions';
import { useToast } from '@/context/ToastContext';
import { AttendanceRecord, Employee } from '@/lib/types';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building,
  Laptop,
  Plus,
  Search,
  Filter,
  Download,
  ShieldCheck,
} from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuth();
  const perms = getRolePermissions(user?.role);
  const { showToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  // Mark attendance form state
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [clockInTime, setClockInTime] = useState('09:00 AM');
  const [clockOutTime, setClockOutTime] = useState('06:00 PM');
  const [attStatus, setAttStatus] = useState<AttendanceRecord['status']>('Present');
  const [workMode, setWorkMode] = useState<AttendanceRecord['workMode']>('Office');
  const [location, setLocation] = useState('Lahore HQ - Floor 3');
  const [notes, setNotes] = useState('');

  const loadAttendance = async () => {
    const [att, empList] = await Promise.all([
      api.getAttendance(),
      api.getEmployees(),
    ]);
    setRecords(att);
    setEmployees(empList);
    if (empList.length > 0 && !selectedEmpId) {
      setSelectedEmpId(empList[0].id);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  // If employee role, only show their own attendance records
  const personalAttendance = records.filter(
    (r) =>
      (user?.employeeCode && r.employeeCode === user.employeeCode) ||
      (user?.name && r.employeeName.toLowerCase() === user.name.toLowerCase())
  );

  const effectiveRecords = perms.canViewAllAttendance
    ? records
    : personalAttendance.length > 0
    ? personalAttendance
    : [
        {
          id: `att-${user?.id || 'emp-3'}`,
          employeeId: user?.id || 'emp-3',
          employeeName: user?.name || 'Usman Tariq',
          employeeCode: user?.employeeCode || 'PK-HRM-103',
          department: user?.department || 'Software Engineering',
          date: selectedDate,
          clockIn: '09:05 AM',
          clockOut: null,
          workDuration: 'Active',
          status: 'Present' as const,
          workMode: 'Office' as const,
          location: 'Islamabad Regional Node',
          notes: 'Biometric verified check-in',
        },
      ];

  const filteredRecords = effectiveRecords.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = effectiveRecords.filter(r => r.status === 'Present').length;
  const lateCount = effectiveRecords.filter(r => r.status === 'Late').length;
  const onLeaveCount = effectiveRecords.filter(r => r.status === 'On Leave').length;
  const absentCount = effectiveRecords.filter(r => r.status === 'Absent').length;

  const handleManualMark = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    await api.markAttendance({
      employeeId: emp.id,
      employeeName: emp.fullName,
      employeeCode: emp.employeeCode,
      department: emp.department,
      date: selectedDate,
      clockIn: clockInTime,
      clockOut: clockOutTime,
      status: attStatus,
      workMode: workMode,
      location: location,
      notes: notes,
      workDuration: '8h 30m',
    });

    showToast(`Attendance entry for ${emp.fullName} recorded in PostgreSQL`, 'success');
    setIsMarkModalOpen(false);
    loadAttendance();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Code', 'Employee', 'Department', 'Clock In', 'Clock Out', 'Status', 'Mode', 'Location'];
    const rows = filteredRecords.map(r => [
      r.date,
      r.employeeCode,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.clockIn,
      r.clockOut || 'Active',
      r.status,
      r.workMode,
      `"${r.location}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pak_attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance log exported to CSV', 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header
        title={perms.canViewAllAttendance ? 'Attendance & Time Tracking' : 'My Attendance & Duty Ledger'}
        subtitle={
          perms.canViewAllAttendance
            ? 'Pakistan Enterprise Biometric, Geolocation & Work-Mode Log'
            : 'Personal biometric check-in logs, hours worked, and punctuality records'
        }
        onClockAction={loadAttendance}
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title={perms.canViewAllAttendance ? 'Present Today' : 'My Present Days'}
            value={presentCount}
            subtitle={perms.canViewAllAttendance ? 'Punctual arrivals verified' : 'Punctual duty verified'}
            change="Normal"
            isPositive={true}
            icon={UserCheck}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          />
          <StatCard
            title={perms.canViewAllAttendance ? 'Late Clock-Ins' : 'My Late Arrivals'}
            value={lateCount}
            subtitle="Arrived after 09:10 AM threshold"
            change="Grace buffer applied"
            isPositive={false}
            icon={Clock}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-50 dark:bg-amber-950/40"
          />
          <StatCard
            title={perms.canViewAllAttendance ? 'On Approved Leave' : 'My Approved Leaves'}
            value={onLeaveCount}
            subtitle="Casual, sick, or annual quotas"
            isPositive={true}
            icon={Calendar}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-50 dark:bg-blue-950/40"
          />
          <StatCard
            title={perms.canViewAllAttendance ? 'Absences' : 'My Absences'}
            value={absentCount}
            subtitle="Unscheduled missing attendances"
            change={absentCount === 0 ? 'Zero Absences' : 'Flagged'}
            isPositive={absentCount === 0}
            icon={AlertTriangle}
            iconColor="text-rose-600 dark:text-rose-400"
            iconBg="bg-rose-50 dark:bg-rose-950/40"
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Log Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 px-3 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="On Leave">On Leave</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {perms.canExportAttendance && (
              <button
                onClick={exportCSV}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Daily Log</span>
              </button>
            )}
            {perms.canRecordManualAttendance ? (
              <button
                onClick={() => setIsMarkModalOpen(true)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Admin Override / Mark</span>
              </button>
            ) : (
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Biometric Clock-in active via Top Header</span>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200/90 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-4">Clock In</th>
                  <th className="py-4 px-4">Clock Out</th>
                  <th className="py-4 px-4">Work Duration</th>
                  <th className="py-4 px-4">Work Mode & Node</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No attendance logs recorded for selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                            {rec.employeeName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{rec.employeeName}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {rec.employeeCode} &bull; {rec.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {rec.clockIn}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {rec.clockOut || (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active On-Duty
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {rec.workDuration}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {rec.workMode === 'Office' ? (
                            <Building className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                          )}
                          <span className="font-bold text-slate-800 dark:text-slate-200">{rec.workMode}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{rec.location}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={rec.status} />
                      </td>

                      <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 text-[11px] italic">
                        {rec.notes || 'Normal routine'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Manual Attendance Mark Modal */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Admin Attendance Manual Override"
        subtitle="Log employee punch-in or adjust status in PostgreSQL attendance ledger"
      >
        <form onSubmit={handleManualMark} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode} - {emp.department})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clock In Time</label>
              <input
                type="text"
                value={clockInTime}
                onChange={(e) => setClockInTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="09:00 AM"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clock Out Time</label>
              <input
                type="text"
                value={clockOutTime}
                onChange={(e) => setClockOutTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="06:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={attStatus}
                onChange={(e) => setAttStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">On Leave</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Workplace</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="e.g. Lahore HQ - Floor 3"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Override Reason / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="e.g. Field client visit in Karachi, biometric scanner offline"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsMarkModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30"
            >
              Record Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
