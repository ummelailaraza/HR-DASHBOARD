using HrmApi.Models;

namespace HrmApi.Data
{
    public static class DbInitializer
    {
        public static void Initialize(HrmDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Employees.Any())
            {
                return; // DB has already been seeded
            }

            var employees = new List<Employee>
            {
                new Employee
                {
                    Id = "emp-1",
                    EmployeeCode = "PK-HRM-101",
                    FirstName = "Ummelaila",
                    LastName = "Raza",
                    FullName = "Ummelaila Raza",
                    Email = "ummelaila.raza@corporate.pk",
                    Phone = "+92 300 8472910",
                    Cnic = "42301-1829304-1",
                    Department = "Software Engineering",
                    Designation = "Principal Cloud Architect",
                    JoiningDate = "2021-03-15",
                    Status = "Active",
                    EmploymentType = "Full-Time",
                    BasicSalary = 380000,
                    Allowances = 45000,
                    TaxDeductions = 42000,
                    NetSalary = 383000,
                    City = "Karachi",
                    Address = "B-45, Block 4, Clifton, Karachi",
                    AvatarUrl = "",
                    EmergencyContact = "+92 321 4455667 (Husband)",
                    BankAccount = "Meezan Bank - 02100109283746"
                },
                new Employee
                {
                    Id = "emp-2",
                    EmployeeCode = "PK-HRM-102",
                    FirstName = "Fatima",
                    LastName = "Zahra",
                    FullName = "Fatima Zahra",
                    Email = "fatima.zahra@corporate.pk",
                    Phone = "+92 321 9845123",
                    Cnic = "42101-7391048-2",
                    Department = "Human Resources",
                    Designation = "Head of People & Culture",
                    JoiningDate = "2020-07-01",
                    Status = "Active",
                    EmploymentType = "Full-Time",
                    BasicSalary = 320000,
                    Allowances = 35000,
                    TaxDeductions = 31000,
                    NetSalary = 324000,
                    City = "Karachi",
                    Address = "B-12, Phase 5, DHA, Karachi",
                    AvatarUrl = "",
                    EmergencyContact = "+92 333 1122334 (Brother)",
                    BankAccount = "Habib Bank Limited - 100482910293"
                },
                new Employee
                {
                    Id = "emp-3",
                    EmployeeCode = "PK-HRM-103",
                    FirstName = "Usman",
                    LastName = "Tariq",
                    FullName = "Usman Tariq",
                    Email = "usman.tariq@corporate.pk",
                    Phone = "+92 333 4567890",
                    Cnic = "61101-4920194-5",
                    Department = "Software Engineering",
                    Designation = "Senior Full Stack Engineer",
                    JoiningDate = "2022-01-10",
                    Status = "Active",
                    EmploymentType = "Full-Time",
                    BasicSalary = 260000,
                    Allowances = 25000,
                    TaxDeductions = 22000,
                    NetSalary = 263000,
                    City = "Islamabad",
                    Address = "Street 14, Sector F-8/2, Islamabad",
                    AvatarUrl = "",
                    EmergencyContact = "+92 302 9988776 (Father)",
                    BankAccount = "Bank Alfalah - 550192837482"
                },
                new Employee
                {
                    Id = "emp-4",
                    EmployeeCode = "PK-HRM-104",
                    FirstName = "Ayesha",
                    LastName = "Siddiqui",
                    FullName = "Ayesha Siddiqui",
                    Email = "ayesha.siddiqui@corporate.pk",
                    Phone = "+92 312 3456781",
                    Cnic = "42201-8392019-4",
                    Department = "Finance & Accounts",
                    Designation = "Chief Financial Controller",
                    JoiningDate = "2019-11-15",
                    Status = "Active",
                    EmploymentType = "Full-Time",
                    BasicSalary = 350000,
                    Allowances = 40000,
                    TaxDeductions = 38000,
                    NetSalary = 352000,
                    City = "Karachi",
                    Address = "Apartment 4B, Creek Vista, DHA Phase 8, Karachi",
                    AvatarUrl = "",
                    EmergencyContact = "+92 315 2233445 (Husband)",
                    BankAccount = "Standard Chartered Bank - 01928374651"
                },
                new Employee
                {
                    Id = "emp-5",
                    EmployeeCode = "PK-HRM-105",
                    FirstName = "Bilal",
                    LastName = "Ahmed Qureshi",
                    FullName = "Bilal Ahmed Qureshi",
                    Email = "bilal.ahmed@corporate.pk",
                    Phone = "+92 301 7891234",
                    Cnic = "35202-3920192-7",
                    Department = "Sales & Marketing",
                    Designation = "VP Corporate Partnerships",
                    JoiningDate = "2021-06-20",
                    Status = "Active",
                    EmploymentType = "Full-Time",
                    BasicSalary = 310000,
                    Allowances = 60000,
                    TaxDeductions = 34000,
                    NetSalary = 336000,
                    City = "Lahore",
                    Address = "House 108, Sector Y, DHA Phase 3, Lahore",
                    AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
                    EmergencyContact = "+92 300 7766554 (Brother)",
                    BankAccount = "MCB Bank - 998822334411"
                },
                new Employee
                {
                    Id = "emp-6",
                    EmployeeCode = "PK-HRM-106",
                    FirstName = "Zainab",
                    LastName = "Bibi",
                    FullName = "Zainab Bibi",
                    Email = "zainab.bibi@corporate.pk",
                    Phone = "+92 334 1234567",
                    Cnic = "37405-5829103-6",
                    Department = "Software Engineering",
                    Designation = "UI/UX & Frontend Lead",
                    JoiningDate = "2022-08-01",
                    Status = "Active",
                    EmploymentType = "Full-Time",
                    BasicSalary = 210000,
                    Allowances = 20000,
                    TaxDeductions = 14000,
                    NetSalary = 216000,
                    City = "Rawalpindi",
                    Address = "Plot 55, Bahria Town Phase 7, Rawalpindi",
                    AvatarUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
                    EmergencyContact = "+92 333 8877665 (Father)",
                    BankAccount = "Faysal Bank - 230019283746"
                }
            };

            context.Employees.AddRange(employees);
            context.SaveChanges();

            var attendance = new List<AttendanceRecord>
            {
                new AttendanceRecord
                {
                    Id = "att-1",
                    EmployeeId = "emp-1",
                    EmployeeName = "Ummelaila Raza",
                    EmployeeCode = "PK-HRM-101",
                    Department = "Software Engineering",
                    Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    ClockIn = "08:55 AM",
                    Status = "Present",
                    WorkMode = "Office",
                    Location = "Karachi Executive Hub - Floor 6",
                    Notes = "Punctual biometric clock-in"
                },
                new AttendanceRecord
                {
                    Id = "att-2",
                    EmployeeId = "emp-2",
                    EmployeeName = "Fatima Zahra",
                    EmployeeCode = "PK-HRM-102",
                    Department = "Human Resources",
                    Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    ClockIn = "09:02 AM",
                    Status = "Present",
                    WorkMode = "Office",
                    Location = "Karachi Regional Hub",
                    Notes = "Executive committee meeting"
                },
                new AttendanceRecord
                {
                    Id = "att-3",
                    EmployeeId = "emp-3",
                    EmployeeName = "Usman Tariq",
                    EmployeeCode = "PK-HRM-103",
                    Department = "Software Engineering",
                    Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    ClockIn = "09:12 AM",
                    Status = "Late",
                    WorkMode = "Remote",
                    Location = "Islamabad Remote Node",
                    Notes = "Traffic delay noted"
                }
            };

            context.AttendanceRecords.AddRange(attendance);

            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = "task-1",
                    Title = "Deploy PostgreSQL Microservices to Azure Pakistan Region",
                    Description = "Finalize Docker containerization, configure connection pooling with Npgsql, and enable automated daily snapshots.",
                    AssigneeId = "emp-1",
                    AssigneeName = "Ummelaila Raza",
                    AssigneeAvatar = "",
                    AssigneeRole = "Principal Cloud Architect",
                    Department = "Software Engineering",
                    Priority = "Urgent",
                    Status = "In Progress",
                    DueDate = DateTime.UtcNow.AddDays(4).ToString("yyyy-MM-dd"),
                    Progress = 75
                },
                new TaskItem
                {
                    Id = "task-2",
                    Title = "Quarterly Performance Appraisals for Tech Team",
                    Description = "Review KPI benchmarks, schedule 1-on-1 feedback sessions, and prepare salary review recommendations.",
                    AssigneeId = "emp-2",
                    AssigneeName = "Fatima Zahra",
                    AssigneeAvatar = "",
                    AssigneeRole = "Head of People & Culture",
                    Department = "Human Resources",
                    Priority = "High",
                    Status = "Todo",
                    DueDate = DateTime.UtcNow.AddDays(10).ToString("yyyy-MM-dd"),
                    Progress = 15
                }
            };

            context.TaskItems.AddRange(tasks);

            var leaves = new List<LeaveRequest>
            {
                new LeaveRequest
                {
                    Id = "leave-1",
                    EmployeeId = "emp-3",
                    EmployeeName = "Usman Tariq",
                    EmployeeCode = "PK-HRM-103",
                    Department = "Software Engineering",
                    LeaveType = "Casual",
                    StartDate = DateTime.UtcNow.AddDays(5).ToString("yyyy-MM-dd"),
                    EndDate = DateTime.UtcNow.AddDays(6).ToString("yyyy-MM-dd"),
                    TotalDays = 2,
                    Reason = "Personal family commitment in Rawalpindi",
                    Status = "Pending"
                }
            };

            context.LeaveRequests.AddRange(leaves);

            var payroll = new List<PayrollRecord>
            {
                new PayrollRecord
                {
                    Id = "pay-1",
                    EmployeeId = "emp-1",
                    EmployeeName = "Ummelaila Raza",
                    EmployeeCode = "PK-HRM-101",
                    Designation = "Principal Cloud Architect",
                    Department = "Software Engineering",
                    Month = "October 2026",
                    BasicSalary = 380000,
                    MedicalAllowance = 25000,
                    ConveyanceAllowance = 20000,
                    GrossSalary = 425000,
                    TaxDeduction = 42000,
                    ProvidentFund = 15000,
                    NetSalary = 368000,
                    PaymentStatus = "Paid",
                    PaymentDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    BankAccount = "Meezan Bank - 02100109283746"
                }
            };

            context.PayrollRecords.AddRange(payroll);
            context.SaveChanges();
        }
    }
}
