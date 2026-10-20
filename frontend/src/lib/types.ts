export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Resigned';
  employmentType: 'Full-Time' | 'Contractual' | 'Intern';
  basicSalary: number; // in PKR
  allowances: number;
  taxDeductions: number;
  netSalary?: number;
  city: string;
  address: string;
  avatarUrl: string;
  gender?: 'female' | 'male';
  emergencyContact: string;
  bankAccount: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  workDuration: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';
  workMode: 'Office' | 'Remote' | 'Hybrid';
  location: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeRole: string;
  assigneeGender?: 'female' | 'male';
  department: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
  progress: number;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: 'Annual' | 'Casual' | 'Sick' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  approvedBy?: string;
  managerComments?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: string;
  month: string;
  basicSalary: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  grossSalary: number;
  taxDeduction: number;
  providentFund: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Pending' | 'Processing';
  paymentDate: string | null;
  bankAccount: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeToday: number;
  onLeaveToday: number;
  lateToday: number;
  attendanceRate: number;
  pendingTasks: number;
  completedTasks: number;
  pendingLeaves: number;
  monthlyPayrollPkr: number;
  departmentDistribution: { [key: string]: number };
}
