'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getRolePermissions } from '@/lib/permissions';
import { PayrollRecord } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import {
  Banknote,
  Printer,
  Download,
  CreditCard,
  ShieldCheck,
  Building2,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function PayrollPage() {
  const { user } = useAuth();
  const perms = getRolePermissions(user?.role);
  const { addToast } = useToast();
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [viewingSlip, setViewingSlip] = useState<PayrollRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPayroll = async () => {
    const list = await api.getPayroll();
    setPayroll(list);
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  // Filter records if role can only view personal payroll
  const filteredPersonal = payroll.filter(
    (p) =>
      (user?.employeeCode && p.employeeCode === user.employeeCode) ||
      (user?.name && p.employeeName.toLowerCase() === user.name.toLowerCase())
  );

  const displayedPayroll = perms.canViewPersonalPayrollOnly
    ? filteredPersonal.length > 0
      ? filteredPersonal
      : [
          {
            id: `pay-${user?.id || 'emp-3'}`,
            employeeId: user?.id || 'emp-3',
            employeeName: user?.name || 'Usman Tariq',
            employeeCode: user?.employeeCode || 'PK-HRM-103',
            designation: 'Senior Full Stack Engineer',
            department: user?.department || 'Software Engineering',
            month: selectedMonth,
            basicSalary: 260000,
            medicalAllowance: 15000,
            conveyanceAllowance: 10000,
            grossSalary: 285000,
            taxDeduction: 22000,
            providentFund: 10000,
            netSalary: 253000,
            paymentStatus: 'Paid' as const,
            paymentDate: '2026-10-01',
            bankAccount: 'Bank Alfalah - 550192837482',
          },
        ]
    : payroll;

  // Company totals
  const totalDisbursed = payroll.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalGross = payroll.reduce((acc, curr) => acc + curr.grossSalary, 0);
  const totalTax = payroll.reduce((acc, curr) => acc + curr.taxDeduction, 0);
  const totalPf = payroll.reduce((acc, curr) => acc + curr.providentFund, 0);

  // Personal totals
  const myNet = displayedPayroll.reduce((acc, curr) => acc + curr.netSalary, 0);
  const myGross = displayedPayroll.reduce((acc, curr) => acc + curr.grossSalary, 0);
  const myTax = displayedPayroll.reduce((acc, curr) => acc + curr.taxDeduction, 0);
  const myPf = displayedPayroll.reduce((acc, curr) => acc + curr.providentFund, 0);

  const handleProcessPayroll = async () => {
    setIsProcessing(true);
    await api.processPayroll(selectedMonth);
    await loadPayroll();
    setIsProcessing(false);
    addToast(
      'success',
      'Batch Disbursed',
      `Payroll batch for ${selectedMonth} processed and bank 1Link files generated.`
    );
  };

  const printPayslip = () => {
    addToast('info', 'Printing Payslip', 'Preparing confidential payslip document for printing...');
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header
        title={perms.canViewPersonalPayrollOnly ? 'My Payroll & Compensation' : 'Payroll & Compensation Governance'}
        subtitle={
          perms.canViewPersonalPayrollOnly
            ? 'Confidential salary slips, FBR Section 149 tax deductions, and provident fund history'
            : 'Manage salary disbursements, FBR Section 149 withholding and provident fund'
        }
        onClockAction={loadPayroll}
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
        {/* Financial Stat Cards in PKR */}
        {perms.canViewPersonalPayrollOnly ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="My Net Salary"
              value={`₨ ${myNet.toLocaleString()}`}
              subtitle="Credited to salary bank account"
              isPositive={true}
              icon={Banknote}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/40"
            />
            <StatCard
              title="My Gross Earnings"
              value={`₨ ${myGross.toLocaleString()}`}
              subtitle="Basic pay + medical & conveyance"
              icon={Building2}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-50 dark:bg-blue-950/40"
            />
            <StatCard
              title="My FBR Tax Withheld"
              value={`₨ ${myTax.toLocaleString()}`}
              subtitle="Section 149 income tax deducted"
              isPositive={true}
              icon={ShieldCheck}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
            />
            <StatCard
              title="My Provident Fund"
              value={`₨ ${myPf.toLocaleString()}`}
              subtitle="Employee & corporate trust pool"
              icon={CreditCard}
              iconColor="text-indigo-600 dark:text-indigo-400"
              iconBg="bg-indigo-50 dark:bg-indigo-950/40"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Net Salary Disbursed"
              value={`₨ ${(totalDisbursed / 1000000).toFixed(2)}M`}
              subtitle="Credited to employee bank accounts"
              isPositive={true}
              icon={Banknote}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/40"
            />
            <StatCard
              title="Gross Payroll Cost"
              value={`₨ ${(totalGross / 1000000).toFixed(2)}M`}
              subtitle="Basic pay + allowances"
              icon={Building2}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-50 dark:bg-blue-950/40"
            />
            <StatCard
              title="FBR Income Tax Withheld"
              value={`₨ ${(totalTax / 1000).toLocaleString()}k`}
              subtitle="Section 149 statutory deposit"
              isPositive={true}
              icon={ShieldCheck}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
            />
            <StatCard
              title="Provident Fund"
              value={`₨ ${(totalPf / 1000).toLocaleString()}k`}
              subtitle="Corporate matched trust pool"
              icon={CreditCard}
              iconColor="text-indigo-600 dark:text-indigo-400"
              iconBg="bg-indigo-50 dark:bg-indigo-950/40"
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Payroll Cycle:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {perms.canDisbursePayroll ? (
              <button
                onClick={handleProcessPayroll}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Processing Batch...' : 'Disburse Monthly Payroll'}</span>
              </button>
            ) : user?.role === 'HR Director' ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>HR Audit Mode &bull; Read-Only (Disbursement clearance: Finance & Admin)</span>
              </div>
            ) : (
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Confidential Personal Salary Record &bull; FBR Tax Compliant</span>
              </div>
            )}
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {perms.canViewPersonalPayrollOnly ? 'My Confidential Salary Slip History' : 'Corporate Payroll Ledger'}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {displayedPayroll.length} {displayedPayroll.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200/90 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Basic Pay (PKR)</th>
                  <th className="py-3.5 px-4">Allowances</th>
                  <th className="py-3.5 px-4">Gross Pay</th>
                  <th className="py-3.5 px-4">FBR Tax</th>
                  <th className="py-3.5 px-4">Net Salary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {displayedPayroll.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900 dark:text-white">{pay.employeeName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {pay.employeeCode} &bull; {pay.designation}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      ₨ {pay.basicSalary.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      ₨ {(pay.medicalAllowance + pay.conveyanceAllowance).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                      ₨ {pay.grossSalary.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-rose-600 dark:text-rose-400">
                      -₨ {pay.taxDeduction.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      ₨ {pay.netSalary.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={pay.paymentStatus} />
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setViewingSlip(pay)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Corporate Payslip Modal */}
      <Modal
        isOpen={!!viewingSlip}
        onClose={() => setViewingSlip(null)}
        title="Official Corporate Salary Slip"
        subtitle={viewingSlip ? `${viewingSlip.employeeName} • ${viewingSlip.month}` : ''}
        maxWidth="max-w-2xl"
      >
        {viewingSlip && (
          <div className="space-y-6 print:p-0">
            {/* Payslip Header */}
            <div className="p-5 rounded-xl bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border border-slate-800">
              <div>
                <h4 className="font-bold text-base tracking-tight">PAKISTAN ENTERPRISE HRMS LTD.</h4>
                <p className="text-xs text-slate-300">Confidential Employee Earnings & Deduction Statement</p>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Tax Year 2026-2027 &bull; NTN: 9482710-3
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600 text-white">
                  {viewingSlip.month}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Ref: {viewingSlip.id}
                </p>
              </div>
            </div>

            {/* Employee Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Employee Name</span>
                <p className="font-bold text-slate-800 dark:text-white">{viewingSlip.employeeName}</p>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Employee Code</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingSlip.employeeCode}</p>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Designation</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{viewingSlip.designation}</p>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Department</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{viewingSlip.department}</p>
              </div>
            </div>

            {/* Salary Breakdown 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Earnings */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs block pb-2 border-b border-slate-100 dark:border-slate-800">
                  Earnings & Allowances (PKR)
                </span>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Basic Salary</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    ₨ {viewingSlip.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Medical Allowance</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    ₨ {viewingSlip.medicalAllowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Conveyance Allowance</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    ₨ {viewingSlip.conveyanceAllowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                  <span>Total Gross Earnings</span>
                  <span className="font-mono">₨ {viewingSlip.grossSalary.toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs block pb-2 border-b border-slate-100 dark:border-slate-800">
                  Statutory Deductions (PKR)
                </span>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>FBR Sec. 149 Income Tax</span>
                  <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                    -₨ {viewingSlip.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Provident Fund (Retirement)</span>
                  <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                    -₨ {viewingSlip.providentFund.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>EOBI Contribution</span>
                  <span className="font-mono font-semibold text-slate-400">₨ 0 (Exempt)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    -₨ {(viewingSlip.taxDeduction + viewingSlip.providentFund).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Transfer Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">
                  Net Amount Transferred to Bank Account
                </span>
                <p className="font-mono text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                  1Link Settlement &bull; {viewingSlip.bankAccount}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                  ₨ {viewingSlip.netSalary.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 print:hidden">
              <button
                onClick={() => setViewingSlip(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={printPayslip}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
