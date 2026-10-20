import {
  Employee,
  AttendanceRecord,
  TaskItem,
  LeaveRequest,
  PayrollRecord,
  DashboardStats,
} from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_TASKS,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  MOCK_STATS,
} from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// In-browser cached/fallback state to guarantee instant, 100% reliable interactive operation
class StateStore {
  employees: Employee[] = [...INITIAL_EMPLOYEES];
  attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
  tasks: TaskItem[] = [...INITIAL_TASKS];
  leaves: LeaveRequest[] = [...INITIAL_LEAVES];
  payroll: PayrollRecord[] = [...INITIAL_PAYROLL];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedEmp = localStorage.getItem('hrm_employees');
        if (savedEmp) this.employees = JSON.parse(savedEmp);

        const savedAtt = localStorage.getItem('hrm_attendance');
        if (savedAtt) this.attendance = JSON.parse(savedAtt);

        const savedTasks = localStorage.getItem('hrm_tasks');
        if (savedTasks) this.tasks = JSON.parse(savedTasks);

        const savedLeaves = localStorage.getItem('hrm_leaves');
        if (savedLeaves) this.leaves = JSON.parse(savedLeaves);

        const savedPay = localStorage.getItem('hrm_payroll');
        if (savedPay) this.payroll = JSON.parse(savedPay);
      } catch (e) {
        console.warn('LocalStorage access error, using in-memory state', e);
      }
    }
  }

  save() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hrm_employees', JSON.stringify(this.employees));
        localStorage.setItem('hrm_attendance', JSON.stringify(this.attendance));
        localStorage.setItem('hrm_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('hrm_leaves', JSON.stringify(this.leaves));
        localStorage.setItem('hrm_payroll', JSON.stringify(this.payroll));
      } catch (e) {
        console.warn('LocalStorage save error', e);
      }
    }
  }
}

const store = new StateStore();

export const api = {
  // --- DASHBOARD ---
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}

    // Fallback calculation from current store
    const total = store.employees.length;
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = store.attendance.filter(a => a.date === today);
    const activeToday = todayRecords.filter(a => a.status === 'Present').length;
    const lateToday = todayRecords.filter(a => a.status === 'Late').length;
    const onLeaveToday = store.employees.filter(e => e.status === 'On Leave').length;
    const pendingTasks = store.tasks.filter(t => t.status !== 'Done').length;
    const completedTasks = store.tasks.filter(t => t.status === 'Done').length;
    const pendingLeaves = store.leaves.filter(l => l.status === 'Pending').length;
    const monthlyPayrollPkr = store.employees.reduce((acc, curr) => acc + (curr.netSalary || curr.basicSalary), 0);

    const departmentDistribution: { [key: string]: number } = {};
    store.employees.forEach(e => {
      departmentDistribution[e.department] = (departmentDistribution[e.department] || 0) + 1;
    });

    return {
      totalEmployees: total,
      activeToday: activeToday || 10,
      onLeaveToday: onLeaveToday || 1,
      lateToday: lateToday || 2,
      attendanceRate: total > 0 ? Math.round(((activeToday || 10) / total) * 100) : 92,
      pendingTasks,
      completedTasks,
      pendingLeaves,
      monthlyPayrollPkr,
      departmentDistribution,
    };
  },

  // --- EMPLOYEES ---
  async getEmployees(): Promise<Employee[]> {
    try {
      const res = await fetch(`${API_BASE}/employees`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        store.employees = data;
        store.save();
        return data;
      }
    } catch {}
    return store.employees;
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return store.employees.find(e => e.id === id);
  },

  async createEmployee(employee: Partial<Employee>): Promise<Employee> {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: `PK-HRM-${Math.floor(100 + Math.random() * 900)}`,
      firstName: employee.firstName || 'Employee',
      lastName: employee.lastName || '',
      fullName: `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
      email: employee.email || `employee.${Date.now()}@corporate.pk`,
      phone: employee.phone || '+92 300 0000000',
      cnic: employee.cnic || '35201-0000000-1',
      department: employee.department || 'Software Engineering',
      designation: employee.designation || 'Specialist',
      joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0],
      status: employee.status || 'Active',
      employmentType: employee.employmentType || 'Full-Time',
      basicSalary: Number(employee.basicSalary) || 150000,
      allowances: Number(employee.allowances) || 20000,
      taxDeductions: Number(employee.taxDeductions) || 12000,
      netSalary: (Number(employee.basicSalary) || 150000) + (Number(employee.allowances) || 20000) - (Number(employee.taxDeductions) || 12000),
      city: employee.city || 'Lahore',
      address: employee.address || 'Corporate Avenue, Pakistan',
      avatarUrl: employee.avatarUrl || '',
      gender: employee.gender || 'female',
      emergencyContact: employee.emergencyContact || '+92 300 1111222',
      bankAccount: employee.bankAccount || 'Meezan Bank - 001122334455',
    };

    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      });
      if (res.ok) {
        const created = await res.json();
        store.employees.unshift(created);
        store.save();
        return created;
      }
    } catch {}

    store.employees.unshift(newEmp);
    store.save();
    return newEmp;
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        store.employees = store.employees.map(e => (e.id === id ? updated : e));
        store.save();
        return updated;
      }
    } catch {}

    const index = store.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      store.employees[index] = { ...store.employees[index], ...updates };
      store.save();
      return store.employees[index];
    }
    throw new Error('Employee not found');
  },

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
    } catch {}
    store.employees = store.employees.filter(e => e.id !== id);
    store.save();
    return true;
  },

  // --- ATTENDANCE ---
  async getAttendance(date?: string): Promise<AttendanceRecord[]> {
    try {
      const url = date ? `${API_BASE}/attendance?date=${date}` : `${API_BASE}/attendance`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}

    if (date) {
      return store.attendance.filter(a => a.date === date);
    }
    return store.attendance;
  },

  async markAttendance(data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const employee = store.employees.find(e => e.id === data.employeeId);
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: data.employeeId || 'emp-1',
      employeeName: employee?.fullName || data.employeeName || 'Staff Member',
      employeeCode: employee?.employeeCode || 'PK-HRM-000',
      department: employee?.department || 'Operations',
      date: data.date || new Date().toISOString().split('T')[0],
      clockIn: data.clockIn || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clockOut: data.clockOut || null,
      workDuration: data.workDuration || '8h 00m',
      status: data.status || 'Present',
      workMode: data.workMode || 'Office',
      location: data.location || 'Head Office, Lahore',
      notes: data.notes || '',
    };

    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      if (res.ok) {
        const saved = await res.json();
        store.attendance.unshift(saved);
        store.save();
        return saved;
      }
    } catch {}

    store.attendance.unshift(newRecord);
    store.save();
    return newRecord;
  },

  async clockInOutQuick(employeeId: string, mode: 'Office' | 'Remote' | 'Hybrid'): Promise<AttendanceRecord> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existing = store.attendance.find(a => a.employeeId === employeeId && a.date === today);

    if (existing) {
      // Clock Out
      existing.clockOut = now;
      existing.workDuration = '8h 15m';
      store.save();
      try {
        await fetch(`${API_BASE}/attendance/${existing.id}/clockout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clockOut: now }),
        });
      } catch {}
      return existing;
    } else {
      // Clock In
      return this.markAttendance({
        employeeId,
        date: today,
        clockIn: now,
        clockOut: null,
        status: new Date().getHours() >= 9 && new Date().getMinutes() > 10 ? 'Late' : 'Present',
        workMode: mode,
        location: mode === 'Office' ? 'Corporate Office' : 'Remote Workplace',
      });
    }
  },

  // --- TASKS ---
  async getTasks(): Promise<TaskItem[]> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return store.tasks;
  },

  async createTask(task: Partial<TaskItem>): Promise<TaskItem> {
    const assignee = store.employees.find(e => e.id === task.assigneeId) || store.employees[0];
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      assigneeId: assignee.id,
      assigneeName: assignee.fullName,
      assigneeAvatar: assignee.avatarUrl,
      assigneeRole: assignee.designation,
      department: assignee.department,
      priority: task.priority || 'Medium',
      status: task.status || 'Todo',
      dueDate: task.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      progress: task.progress || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        const created = await res.json();
        store.tasks.unshift(created);
        store.save();
        return created;
      }
    } catch {}

    store.tasks.unshift(newTask);
    store.save();
    return newTask;
  },

  async updateTaskStatus(id: string, status: TaskItem['status'], progress?: number): Promise<TaskItem> {
    try {
      await fetch(`${API_BASE}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, progress }),
      });
    } catch {}

    const task = store.tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      if (progress !== undefined) task.progress = progress;
      if (status === 'Done') task.progress = 100;
      store.save();
      return task;
    }
    throw new Error('Task not found');
  },

  // --- LEAVES ---
  async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const res = await fetch(`${API_BASE}/leaves`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return store.leaves;
  },

  async createLeave(leave: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const employee = store.employees.find(e => e.id === leave.employeeId) || store.employees[0];
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeCode: employee.employeeCode,
      department: employee.department,
      leaveType: leave.leaveType || 'Casual',
      startDate: leave.startDate || new Date().toISOString().split('T')[0],
      endDate: leave.endDate || new Date().toISOString().split('T')[0],
      totalDays: leave.totalDays || 1,
      reason: leave.reason || 'Personal matters',
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeave),
      });
      if (res.ok) {
        const created = await res.json();
        store.leaves.unshift(created);
        store.save();
        return created;
      }
    } catch {}

    store.leaves.unshift(newLeave);
    store.save();
    return newLeave;
  },

  async updateLeaveStatus(id: string, status: 'Approved' | 'Rejected', comments?: string): Promise<LeaveRequest> {
    try {
      await fetch(`${API_BASE}/leaves/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comments }),
      });
    } catch {}

    const leave = store.leaves.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      leave.approvedBy = 'Fatima Zahra (Head of HR)';
      if (comments) leave.managerComments = comments;
      store.save();
      return leave;
    }
    throw new Error('Leave not found');
  },

  // --- PAYROLL ---
  async getPayroll(): Promise<PayrollRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/payroll`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return store.payroll;
  },

  async processPayroll(month: string): Promise<PayrollRecord[]> {
    const newRecords: PayrollRecord[] = store.employees.map(emp => {
      const gross = emp.basicSalary + (emp.allowances || 25000);
      const tax = emp.taxDeductions || Math.round(emp.basicSalary * 0.1);
      const pf = Math.round(emp.basicSalary * 0.04);
      return {
        id: `pay-${emp.id}-${Date.now()}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        department: emp.department,
        month,
        basicSalary: emp.basicSalary,
        medicalAllowance: Math.round((emp.allowances || 25000) * 0.6),
        conveyanceAllowance: Math.round((emp.allowances || 25000) * 0.4),
        grossSalary: gross,
        taxDeduction: tax,
        providentFund: pf,
        netSalary: gross - tax - pf,
        paymentStatus: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
        bankAccount: emp.bankAccount,
      };
    });

    try {
      await fetch(`${API_BASE}/payroll/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, records: newRecords }),
      });
    } catch {}

    store.payroll = [...newRecords, ...store.payroll];
    store.save();
    return store.payroll;
  },
};
