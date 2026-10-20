import { AuthUser } from '@/context/AuthContext';

export type UserRole = AuthUser['role'];

export interface RolePermissions {
  // Navigation & Tabs
  canAccessEmployees: boolean;
  canAccessPayroll: boolean;
  canAccessAttendance: boolean;
  canAccessTasks: boolean;
  canAccessLeaves: boolean;

  // Employees Tab
  canViewAllEmployees: boolean;
  canCreateEmployee: boolean;
  canEditEmployee: boolean;
  canDeleteEmployee: boolean;
  canViewCompensationDossier: boolean;

  // Payroll Tab
  canViewAllPayroll: boolean;
  canDisbursePayroll: boolean;
  canViewPersonalPayrollOnly: boolean;

  // Attendance Tab
  canViewAllAttendance: boolean;
  canRecordManualAttendance: boolean;
  canExportAttendance: boolean;

  // Leaves Tab
  canViewAllLeaves: boolean;
  canApproveLeaves: boolean;
  canApplyForOthers: boolean;

  // Tasks Tab
  canAssignTasksToAll: boolean;
  canCreateTasks: boolean;
  canUpdateAnyTask: boolean;
}

export function getRolePermissions(role?: UserRole): RolePermissions {
  switch (role) {
    case 'Admin':
      return {
        canAccessEmployees: true,
        canAccessPayroll: true,
        canAccessAttendance: true,
        canAccessTasks: true,
        canAccessLeaves: true,

        canViewAllEmployees: true,
        canCreateEmployee: true,
        canEditEmployee: true,
        canDeleteEmployee: true,
        canViewCompensationDossier: true,

        canViewAllPayroll: true,
        canDisbursePayroll: true,
        canViewPersonalPayrollOnly: false,

        canViewAllAttendance: true,
        canRecordManualAttendance: true,
        canExportAttendance: true,

        canViewAllLeaves: true,
        canApproveLeaves: true,
        canApplyForOthers: true,

        canAssignTasksToAll: true,
        canCreateTasks: true,
        canUpdateAnyTask: true,
      };

    case 'HR Director':
      return {
        canAccessEmployees: true,
        canAccessPayroll: true,
        canAccessAttendance: true,
        canAccessTasks: true,
        canAccessLeaves: true,

        canViewAllEmployees: true,
        canCreateEmployee: true,
        canEditEmployee: true,
        canDeleteEmployee: true,
        canViewCompensationDossier: true,

        canViewAllPayroll: true,
        canDisbursePayroll: false, // Disbursal is Finance & Admin only
        canViewPersonalPayrollOnly: false,

        canViewAllAttendance: true,
        canRecordManualAttendance: true,
        canExportAttendance: true,

        canViewAllLeaves: true,
        canApproveLeaves: true,
        canApplyForOthers: true,

        canAssignTasksToAll: true,
        canCreateTasks: true,
        canUpdateAnyTask: true,
      };

    case 'Financial Controller':
      return {
        canAccessEmployees: true,
        canAccessPayroll: true,
        canAccessAttendance: true,
        canAccessTasks: true,
        canAccessLeaves: true,

        canViewAllEmployees: true,
        canCreateEmployee: false, // Read-only on employee directory
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewCompensationDossier: true,

        canViewAllPayroll: true,
        canDisbursePayroll: true,
        canViewPersonalPayrollOnly: false,

        canViewAllAttendance: true,
        canRecordManualAttendance: false, // Read-only for timesheet auditing
        canExportAttendance: true,

        canViewAllLeaves: true,
        canApproveLeaves: false, // Leaves approval is HR & Admin
        canApplyForOthers: false,

        canAssignTasksToAll: false,
        canCreateTasks: true,
        canUpdateAnyTask: false,
      };

    case 'Employee':
    default:
      return {
        // Normal employee cannot access employee directory
        canAccessEmployees: false,
        canAccessPayroll: true,
        canAccessAttendance: true,
        canAccessTasks: true,
        canAccessLeaves: true,

        canViewAllEmployees: false,
        canCreateEmployee: false,
        canEditEmployee: false,
        canDeleteEmployee: false,
        canViewCompensationDossier: false,

        // Personal payroll only
        canViewAllPayroll: false,
        canDisbursePayroll: false,
        canViewPersonalPayrollOnly: true,

        // Personal attendance only
        canViewAllAttendance: false,
        canRecordManualAttendance: false,
        canExportAttendance: false,

        // Personal leaves only, no approval rights
        canViewAllLeaves: false,
        canApproveLeaves: false,
        canApplyForOthers: false,

        // Personal tasks
        canAssignTasksToAll: false,
        canCreateTasks: true,
        canUpdateAnyTask: false,
      };
  }
}
