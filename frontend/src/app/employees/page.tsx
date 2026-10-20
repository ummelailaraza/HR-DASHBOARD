'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import Avatar from '@/components/Avatar';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getRolePermissions } from '@/lib/permissions';
import { useToast } from '@/context/ToastContext';
import { Employee } from '@/lib/types';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  FileText,
  Briefcase,
  User,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export default function EmployeesPage() {
  const { user } = useAuth();
  const perms = getRolePermissions(user?.role);
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [dossierTab, setDossierTab] = useState<'profile' | 'job' | 'payroll'>('profile');

  // Form states for new/edited employee
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+92 300 ',
    cnic: '35201-',
    department: 'Software Engineering',
    designation: '',
    basicSalary: 200000,
    allowances: 25000,
    taxDeductions: 18000,
    city: 'Lahore',
    address: '',
    employmentType: 'Full-Time',
    bankAccount: 'Meezan Bank - ',
  });

  const loadEmployees = async () => {
    const list = await api.getEmployees();
    setEmployees(list);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cnic.includes(searchTerm);
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '+92 300 ',
      cnic: '35201-',
      department: 'Software Engineering',
      designation: '',
      basicSalary: 200000,
      allowances: 25000,
      taxDeductions: 18000,
      city: 'Lahore',
      address: '',
      employmentType: 'Full-Time',
      bankAccount: 'Meezan Bank - ',
      status: 'Active',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete employee record for ${name}?`)) {
      await api.deleteEmployee(id);
      showToast(`Employee ${name} deleted from database`, 'info');
      loadEmployees();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      await api.updateEmployee(editingEmployee.id, formData);
      showToast(`Profile for ${formData.firstName} updated successfully`, 'success');
    } else {
      await api.createEmployee(formData);
      showToast(`New employee ${formData.firstName} onboarded to PostgreSQL`, 'success');
    }
    setIsAddModalOpen(false);
    loadEmployees();
  };

  const exportCSV = () => {
    const headers = ['Code', 'Name', 'Email', 'Phone', 'CNIC', 'Department', 'Designation', 'City', 'Basic Salary (PKR)', 'Status'];
    const rows = filteredEmployees.map(e => [
      e.employeeCode,
      `"${e.fullName}"`,
      e.email,
      e.phone,
      e.cnic,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.city,
      e.basicSalary,
      e.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pak_employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Employee directory exported to CSV', 'success');
  };

  if (!perms.canAccessEmployees) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <Header
          title="Employee Directory"
          subtitle="Enterprise personnel database and dossiers"
        />
        <main className="p-8 max-w-2xl mx-auto w-full my-auto flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 shadow-xl shadow-rose-500/10">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-3.5 py-1 rounded-full mb-3 border border-rose-200 dark:border-rose-900/50">
            Access Restricted &bull; Confidential Dossiers
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
            Employee Directory Clearance Required
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
            The Employee Directory contains confidential personnel profiles, CNICs, personal contact info, and compensation packages. Your current role (<span className="font-bold text-slate-800 dark:text-slate-200">{user?.role || 'Employee'}</span>) is restricted from accessing this tab.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Dashboard</span>
            </Link>
            <Link
              href="/payroll"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shadow-sm"
            >
              <span>View My Salary & Payslip</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header
        title="Employee Directory"
        subtitle="Manage and onboard enterprise workforce across Pakistan"
        onClockAction={loadEmployees}
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, CNIC, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full sm:w-48 px-3 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-36 px-3 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
            </select>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            {perms.canCreateEmployee && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Scaffold New Employee</span>
              </button>
            )}
          </div>
        </div>

        {/* Employee Data Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200/90 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-4">Designation & Dept</th>
                  <th className="py-4 px-4">Contact & CNIC</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Salary (PKR)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No matching employee records found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={emp.avatarUrl}
                            name={emp.fullName}
                            gender={emp.gender}
                            size="md"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {emp.fullName}
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                              {emp.employeeCode} &bull; Joined {emp.joiningDate}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Dept */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{emp.designation}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">{emp.department}</p>
                      </td>

                      {/* Contact & CNIC */}
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{emp.phone}</p>
                        <p className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">CNIC: {emp.cnic}</p>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {emp.city}
                        </span>
                      </td>

                      {/* Basic Salary PKR */}
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-bold text-slate-900 dark:text-white">
                          ₨ {emp.basicSalary.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400">Basic / mo</p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge status={emp.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setViewingEmployee(emp);
                              setDossierTab('profile');
                            }}
                            title="View Full Profile"
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {perms.canEditEmployee && (
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              title="Edit Details"
                              className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {perms.canDeleteEmployee && (
                            <button
                              onClick={() => handleDelete(emp.id, emp.fullName)}
                              title="Delete Record"
                              className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingEmployee ? `Edit Employee: ${editingEmployee.fullName}` : 'Onboard New Pakistani Employee'}
        subtitle="Registers full profile in PostgreSQL database with tax and payroll bindings"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Tariq"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Mehmood"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="tariq.mehmood@corporate.pk"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile (+92)</label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="+92 300 1234567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pakistani CNIC Number</label>
              <input
                type="text"
                required
                value={formData.cnic || ''}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="35201-1234567-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City Node</label>
              <select
                value={formData.city || 'Lahore'}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={formData.department || 'Software Engineering'}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Operations">Operations</option>
                <option value="Customer Success">Customer Success</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation || ''}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g. Senior Backend Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Basic Salary (PKR)</label>
              <input
                type="number"
                required
                value={formData.basicSalary || ''}
                onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="200000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Allowances (PKR)</label>
              <input
                type="number"
                value={formData.allowances || ''}
                onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">FBR Tax Withholding</label>
              <input
                type="number"
                value={formData.taxDeductions || ''}
                onChange={(e) => setFormData({ ...formData, taxDeductions: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="15000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bank Account</label>
              <input
                type="text"
                value={formData.bankAccount || ''}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Meezan / HBL / MCB IBAN"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30"
            >
              {editingEmployee ? 'Update Profile' : 'Save to PostgreSQL'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detailed Employee Dossier Modal with Tabs */}
      <Modal
        isOpen={!!viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        title="Employee Corporate Dossier"
        subtitle={viewingEmployee ? `${viewingEmployee.fullName} • ${viewingEmployee.employeeCode}` : ''}
        maxWidth="max-w-2xl"
      >
        {viewingEmployee && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <Avatar
                src={viewingEmployee.avatarUrl}
                name={viewingEmployee.fullName}
                gender={viewingEmployee.gender}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{viewingEmployee.fullName}</h4>
                  <Badge status={viewingEmployee.status} />
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{viewingEmployee.designation}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{viewingEmployee.department} &bull; {viewingEmployee.city}, Pakistan</p>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setDossierTab('profile')}
                className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-all ${
                  dossierTab === 'profile'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal & CNIC</span>
              </button>
              <button
                onClick={() => setDossierTab('job')}
                className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-all ${
                  dossierTab === 'job'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job & Role</span>
              </button>
              <button
                onClick={() => setDossierTab('payroll')}
                className={`pb-2.5 px-4 flex items-center gap-1.5 border-b-2 transition-all ${
                  dossierTab === 'payroll'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Compensation (PKR)</span>
              </button>
            </div>

            {/* Tab Contents */}
            {dossierTab === 'profile' && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Pakistani CNIC Number</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{viewingEmployee.cnic}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Contact Phone</span>
                  <p className="font-medium text-slate-900 dark:text-white">{viewingEmployee.phone}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Corporate Email</span>
                  <p className="font-medium text-slate-900 dark:text-white">{viewingEmployee.email}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Emergency Contact</span>
                  <p className="font-medium text-slate-900 dark:text-white">{viewingEmployee.emergencyContact}</p>
                </div>
                <div className="col-span-2 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Residential Address</span>
                  <p className="font-medium text-slate-900 dark:text-white">{viewingEmployee.address}</p>
                </div>
              </div>
            )}

            {dossierTab === 'job' && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Department</span>
                  <p className="font-bold text-slate-900 dark:text-white">{viewingEmployee.department}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Employment Type</span>
                  <p className="font-bold text-slate-900 dark:text-white">{viewingEmployee.employmentType}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Joining Date</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{viewingEmployee.joiningDate}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="text-slate-400 font-medium">Assigned Office Node</span>
                  <p className="font-bold text-slate-900 dark:text-white">{viewingEmployee.city} Hub</p>
                </div>
              </div>
            )}

            {dossierTab === 'payroll' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-300">Monthly Compensation Ledger</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">PKR Currency</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Basic Salary</span>
                      <p className="font-mono font-bold text-sm">₨ {viewingEmployee.basicSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Allowances</span>
                      <p className="font-mono font-bold text-blue-300 text-sm">+₨ {viewingEmployee.allowances.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">FBR Tax Withheld</span>
                      <p className="font-mono font-bold text-rose-300 text-sm">-₨ {viewingEmployee.taxDeductions.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">Net Salary Payable</span>
                    <span className="text-base font-mono font-extrabold text-emerald-400">
                      ₨ {(viewingEmployee.netSalary || (viewingEmployee.basicSalary + viewingEmployee.allowances - viewingEmployee.taxDeductions)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-white">Bank Transfer Account: </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{viewingEmployee.bankAccount}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
