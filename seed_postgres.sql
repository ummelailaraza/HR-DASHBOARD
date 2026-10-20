-- PakHRM Enterprise PostgreSQL Database Schema & Pakistani Data Seed
-- Connected to hrm_db on PostgreSQL 18

CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(100) PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    cnic VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    joining_date VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    employment_type VARCHAR(50) NOT NULL DEFAULT 'Full-Time',
    basic_salary NUMERIC(12,2) NOT NULL,
    allowances NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_salary NUMERIC(12,2) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Lahore',
    address TEXT,
    avatar_url TEXT,
    emergency_contact VARCHAR(150),
    bank_account VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(200) NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date VARCHAR(20) NOT NULL,
    clock_in VARCHAR(20) NOT NULL,
    clock_out VARCHAR(20),
    work_duration VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Present',
    work_mode VARCHAR(50) NOT NULL DEFAULT 'Office',
    location VARCHAR(150),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS task_items (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    assignee_id VARCHAR(100) REFERENCES employees(id) ON DELETE CASCADE,
    assignee_name VARCHAR(200) NOT NULL,
    assignee_avatar TEXT,
    assignee_role VARCHAR(150),
    department VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    status VARCHAR(50) NOT NULL DEFAULT 'Todo',
    due_date VARCHAR(20) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(200) NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL DEFAULT 'Casual',
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    applied_at VARCHAR(20) NOT NULL,
    approved_by VARCHAR(150),
    manager_comments TEXT
);

CREATE TABLE IF NOT EXISTS payroll_records (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(200) NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    month VARCHAR(50) NOT NULL,
    basic_salary NUMERIC(12,2) NOT NULL,
    medical_allowance NUMERIC(12,2) NOT NULL DEFAULT 0,
    conveyance_allowance NUMERIC(12,2) NOT NULL DEFAULT 0,
    gross_salary NUMERIC(12,2) NOT NULL,
    tax_deduction NUMERIC(12,2) NOT NULL DEFAULT 0,
    provident_fund NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_salary NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Paid',
    payment_date VARCHAR(20),
    bank_account VARCHAR(150)
);

-- Clean existing data for clean idempotent seed
TRUNCATE TABLE payroll_records, leave_requests, task_items, attendance_records, employees CASCADE;

-- Insert Pakistani Employees
INSERT INTO employees (id, employee_code, first_name, last_name, full_name, email, phone, cnic, department, designation, joining_date, status, employment_type, basic_salary, allowances, tax_deductions, net_salary, city, address, avatar_url, emergency_contact, bank_account)
VALUES
('emp-1', 'PK-HRM-101', 'Ummelaila', 'Raza', 'Ummelaila Raza', 'ummelaila.raza@corporate.pk', '+92 300 8472910', '42301-1829304-1', 'Software Engineering', 'Principal Cloud Architect', '2021-03-15', 'Active', 'Full-Time', 380000, 45000, 42000, 383000, 'Karachi', 'B-45, Block 4, Clifton, Karachi', '', '+92 321 4455667 (Husband)', 'Meezan Bank - 02100109283746'),
('emp-2', 'PK-HRM-102', 'Fatima', 'Zahra', 'Fatima Zahra', 'fatima.zahra@corporate.pk', '+92 321 9845123', '42101-7391048-2', 'Human Resources', 'Head of People & Culture', '2020-07-01', 'Active', 'Full-Time', 320000, 35000, 31000, 324000, 'Karachi', 'B-12, Phase 5, DHA, Karachi', '', '+92 333 1122334 (Brother)', 'Habib Bank Limited - 100482910293'),
('emp-3', 'PK-HRM-103', 'Usman', 'Tariq', 'Usman Tariq', 'usman.tariq@corporate.pk', '+92 333 4567890', '61101-4920194-5', 'Software Engineering', 'Senior Full Stack Engineer', '2022-01-10', 'Active', 'Full-Time', 260000, 25000, 22000, 263000, 'Islamabad', 'Street 14, Sector F-8/2, Islamabad', '', '+92 302 9988776 (Father)', 'Bank Alfalah - 550192837482'),
('emp-4', 'PK-HRM-104', 'Ayesha', 'Siddiqui', 'Ayesha Siddiqui', 'ayesha.siddiqui@corporate.pk', '+92 312 3456781', '42201-8392019-4', 'Finance & Accounts', 'Chief Financial Controller', '2019-11-15', 'Active', 'Full-Time', 350000, 40000, 38000, 352000, 'Karachi', 'Apartment 4B, Creek Vista, DHA Phase 8, Karachi', '', '+92 315 2233445 (Husband)', 'Standard Chartered Bank - 01928374651'),
('emp-5', 'PK-HRM-105', 'Bilal', 'Ahmed Qureshi', 'Bilal Ahmed Qureshi', 'bilal.ahmed@corporate.pk', '+92 301 7891234', '35202-3920192-7', 'Sales & Marketing', 'VP Corporate Partnerships', '2021-06-20', 'Active', 'Full-Time', 310000, 60000, 34000, 336000, 'Lahore', 'House 108, Sector Y, DHA Phase 3, Lahore', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', '+92 300 7766554 (Brother)', 'MCB Bank - 998822334411'),
('emp-6', 'PK-HRM-106', 'Zainab', 'Bibi', 'Zainab Bibi', 'zainab.bibi@corporate.pk', '+92 334 1234567', '37405-5829103-6', 'Software Engineering', 'UI/UX & Frontend Lead', '2022-08-01', 'Active', 'Full-Time', 210000, 20000, 14000, 216000, 'Rawalpindi', 'Plot 55, Bahria Town Phase 7, Rawalpindi', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', '+92 333 8877665 (Father)', 'Faysal Bank - 230019283746'),
('emp-7', 'PK-HRM-107', 'Hamza', 'Farooq', 'Hamza Farooq', 'hamza.farooq@corporate.pk', '+92 345 6789012', '35201-9281734-9', 'Quality Assurance', 'Lead QA Automation Engineer', '2023-02-15', 'On Leave', 'Full-Time', 185000, 15000, 11000, 189000, 'Lahore', 'House 21, Gulberg III, Lahore', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', '+92 300 4433221 (Mother)', 'Allied Bank - 091827364512'),
('emp-8', 'PK-HRM-108', 'Maryam', 'Nawaz Abbasi', 'Maryam Nawaz Abbasi', 'maryam.abbasi@corporate.pk', '+92 331 8765432', '61101-7291038-8', 'Operations', 'Director of Enterprise Operations', '2020-04-10', 'Active', 'Full-Time', 290000, 30000, 27000, 293000, 'Islamabad', 'Villa 9, Sector I-8/4, Islamabad', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250', '+92 322 7788990 (Brother)', 'United Bank Limited - 220192837465'),
('emp-9', 'PK-HRM-109', 'Omer', 'Saeed', 'Omer Saeed', 'omer.saeed@corporate.pk', '+92 303 1122334', '33100-8291048-3', 'Software Engineering', '.NET & Distributed Systems Specialist', '2023-05-02', 'Active', 'Full-Time', 230000, 20000, 17000, 233000, 'Faisalabad', 'Canal Road, Officers Colony, Faisalabad', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', '+92 301 6655443 (Father)', 'Askari Bank - 100928374650'),
('emp-10', 'PK-HRM-110', 'Hina', 'Altaf Malik', 'Hina Altaf Malik', 'hina.altaf@corporate.pk', '+92 323 5566778', '42301-6192834-6', 'Human Resources', 'Senior Talent Acquisition Specialist', '2022-11-15', 'Active', 'Full-Time', 160000, 15000, 8000, 167000, 'Karachi', 'Block 7, Gulshan-e-Iqbal, Karachi', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250', '+92 312 9900112 (Sister)', 'BankIslami - 900182736452'),
('emp-11', 'PK-HRM-111', 'Kamran', 'Aslam', 'Kamran Aslam', 'kamran.aslam@corporate.pk', '+92 300 9988112', '35202-9182736-5', 'Finance & Accounts', 'Senior Payroll & Compliance Officer', '2023-08-10', 'Probation', 'Full-Time', 140000, 12000, 6000, 146000, 'Lahore', 'Model Town, Block C, Lahore', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250', '+92 300 2211443 (Uncle)', 'Habib Metro Bank - 440192837465'),
('emp-12', 'PK-HRM-112', 'Sana', 'Javed', 'Sana Javed', 'sana.javed@corporate.pk', '+92 333 7788991', '17301-4910293-2', 'Customer Success', 'Enterprise Success Manager', '2023-10-01', 'Active', 'Full-Time', 175000, 18000, 10000, 183000, 'Peshawar', 'Hayatabad Phase 3, Peshawar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', '+92 334 5544332 (Mother)', 'Bank of Khyber - 001928374651');

-- Insert Attendance Records
INSERT INTO attendance_records (id, employee_id, employee_name, employee_code, department, date, clock_in, clock_out, work_duration, status, work_mode, location, notes)
VALUES
('att-1', 'emp-1', 'Ummelaila Raza', 'PK-HRM-101', 'Software Engineering', '2026-10-14', '08:55 AM', NULL, 'Current', 'Present', 'Office', 'Karachi Executive Hub - Floor 6', 'Punctual biometric check-in'),
('att-2', 'emp-2', 'Fatima Zahra', 'PK-HRM-102', 'Human Resources', '2026-10-14', '09:02 AM', NULL, 'Current', 'Present', 'Office', 'Karachi Regional Hub', 'Executive meeting'),
('att-3', 'emp-3', 'Usman Tariq', 'PK-HRM-103', 'Software Engineering', '2026-10-14', '09:12 AM', NULL, 'Current', 'Late', 'Remote', 'Islamabad Remote Node', 'Traffic delay reported'),
('att-4', 'emp-4', 'Ayesha Siddiqui', 'PK-HRM-104', 'Finance & Accounts', '2026-10-14', '08:48 AM', NULL, 'Current', 'Present', 'Office', 'Karachi Regional Hub', 'Quarterly audit review'),
('att-5', 'emp-5', 'Bilal Ahmed Qureshi', 'PK-HRM-105', 'Sales & Marketing', '2026-10-14', '09:00 AM', NULL, 'Current', 'Present', 'Hybrid', 'Lahore HQ - Executive Wing', 'Client meeting scheduled'),
('att-6', 'emp-6', 'Zainab Bibi', 'PK-HRM-106', 'Software Engineering', '2026-10-14', '08:58 AM', NULL, 'Current', 'Present', 'Remote', 'Rawalpindi Remote', 'Frontend sprint sprint review'),
('att-7', 'emp-7', 'Hamza Farooq', 'PK-HRM-107', 'Quality Assurance', '2026-10-14', '-', NULL, '0h', 'On Leave', 'Office', 'On Approved Annual Leave', 'Hunza family trip'),
('att-8', 'emp-8', 'Maryam Nawaz Abbasi', 'PK-HRM-108', 'Operations', '2026-10-14', '08:50 AM', NULL, 'Current', 'Present', 'Office', 'Islamabad Corporate Office', 'Operational inspection'),
('att-9', 'emp-9', 'Omer Saeed', 'PK-HRM-109', 'Software Engineering', '2026-10-14', '09:35 AM', NULL, 'Current', 'Late', 'Hybrid', 'Faisalabad Tech Lab', 'Server deployment overnight'),
('att-10', 'emp-10', 'Hina Altaf Malik', 'PK-HRM-110', 'Human Resources', '2026-10-14', '09:05 AM', NULL, 'Current', 'Present', 'Office', 'Karachi Regional Hub', 'Recruitment interviews'),
('att-11', 'emp-11', 'Kamran Aslam', 'PK-HRM-111', 'Finance & Accounts', '2026-10-14', '08:45 AM', NULL, 'Current', 'Present', 'Office', 'Lahore HQ - Floor 2', 'Payroll reconciliation'),
('att-12', 'emp-12', 'Sana Javed', 'PK-HRM-112', 'Customer Success', '2026-10-14', '09:00 AM', NULL, 'Current', 'Present', 'Remote', 'Peshawar Remote Node', 'Enterprise tier support');

-- Insert Tasks
INSERT INTO task_items (id, title, description, assignee_id, assignee_name, assignee_avatar, assignee_role, department, priority, status, due_date, progress, created_at)
VALUES
('task-1', 'Deploy PostgreSQL Microservices to Azure Pakistan Region', 'Finalize Docker containerization, configure connection pooling with Npgsql, and enable automated daily snapshots.', 'emp-1', 'Ummelaila Raza', '', 'Principal Cloud Architect', 'Software Engineering', 'Urgent', 'In Progress', '2026-10-18', 75, '2026-10-10'),
('task-2', 'Quarterly Performance Appraisals for Tech Team', 'Review KPI benchmarks, schedule 1-on-1 feedback sessions, and prepare salary review recommendations.', 'emp-2', 'Fatima Zahra', '', 'Head of People & Culture', 'Human Resources', 'High', 'Todo', '2026-10-25', 15, '2026-10-12'),
('task-3', 'Implement Biometric Attendance Sync with .NET API', 'Write C# background worker service to poll ZKTeco biometric devices across Lahore and Karachi offices and ingest into PostgreSQL.', 'emp-3', 'Usman Tariq', '', 'Senior Full Stack Engineer', 'Software Engineering', 'High', 'In Progress', '2026-10-20', 50, '2026-10-11'),
('task-4', 'FBR Tax Withholding & Annual Audit Compliance', 'Prepare withholding tax certificates under Section 149 of Income Tax Ordinance 2001 for all permanent staff.', 'emp-4', 'Ayesha Siddiqui', '', 'Chief Financial Controller', 'Finance & Accounts', 'Urgent', 'Review', '2026-10-16', 90, '2026-10-05'),
('task-5', 'Corporate Mobile Banking & HRM Portal UI Redesign', 'Deliver high-fidelity Tailwind CSS design system with corporate navy aesthetic and responsive data tables.', 'emp-6', 'Zainab Bibi', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', 'UI/UX & Frontend Lead', 'Software Engineering', 'Medium', 'Done', '2026-10-14', 100, '2026-10-01'),
('task-6', 'Security Penetration Testing for Employee Data Endpoints', 'Perform OWASP Top 10 automated vulnerability scanning and audit JWT authentication handlers on ASP.NET Core API.', 'emp-9', 'Omer Saeed', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', '.NET & Distributed Systems Specialist', 'Software Engineering', 'High', 'Todo', '2026-10-22', 0, '2026-10-13');

-- Insert Leave Requests
INSERT INTO leave_requests (id, employee_id, employee_name, employee_code, department, leave_type, start_date, end_date, total_days, reason, status, applied_at, approved_by, manager_comments)
VALUES
('leave-1', 'emp-7', 'Hamza Farooq', 'PK-HRM-107', 'Quality Assurance', 'Annual', '2026-10-14', '2026-10-18', 5, 'Family trip to northern areas (Hunza valley)', 'Approved', '2026-10-08', 'Fatima Zahra (HR Head)', 'Approved. QA backlog covered by Omer.'),
('leave-2', 'emp-3', 'Usman Tariq', 'PK-HRM-103', 'Software Engineering', 'Casual', '2026-10-24', '2026-10-25', 2, 'Personal family commitment in Rawalpindi', 'Pending', '2026-10-13', NULL, 'Pending review by department manager.'),
('leave-3', 'emp-11', 'Kamran Aslam', 'PK-HRM-111', 'Finance & Accounts', 'Sick', '2026-10-02', '2026-10-03', 2, 'Viral flu and doctor recommended rest', 'Approved', '2026-10-02', 'Ayesha Siddiqui (CFC)', 'Medical certificate provided.'),
('leave-4', 'emp-5', 'Bilal Ahmed Qureshi', 'PK-HRM-105', 'Sales & Marketing', 'Annual', '2026-11-01', '2026-11-07', 7, 'Annual family pilgrimage vacation', 'Pending', '2026-10-12', NULL, NULL);

-- Insert Payroll Records
INSERT INTO payroll_records (id, employee_id, employee_name, employee_code, designation, department, month, basic_salary, medical_allowance, conveyance_allowance, gross_salary, tax_deduction, provident_fund, net_salary, payment_status, payment_date, bank_account)
VALUES
('pay-1', 'emp-1', 'Ummelaila Raza', 'PK-HRM-101', 'Principal Cloud Architect', 'Software Engineering', 'October 2026', 380000, 25000, 20000, 425000, 42000, 15000, 368000, 'Paid', '2026-10-01', 'Meezan Bank - 02100109283746'),
('pay-2', 'emp-2', 'Fatima Zahra', 'PK-HRM-102', 'Head of People & Culture', 'Human Resources', 'October 2026', 320000, 20000, 15000, 355000, 31000, 12000, 312000, 'Paid', '2026-10-01', 'Habib Bank Limited - 100482910293'),
('pay-3', 'emp-3', 'Usman Tariq', 'PK-HRM-103', 'Senior Full Stack Engineer', 'Software Engineering', 'October 2026', 260000, 15000, 10000, 285000, 22000, 10000, 253000, 'Paid', '2026-10-01', 'Bank Alfalah - 550192837482'),
('pay-4', 'emp-4', 'Ayesha Siddiqui', 'PK-HRM-104', 'Chief Financial Controller', 'Finance & Accounts', 'October 2026', 350000, 25000, 15000, 390000, 38000, 14000, 338000, 'Paid', '2026-10-01', 'Standard Chartered Bank - 01928374651'),
('pay-5', 'emp-5', 'Bilal Ahmed Qureshi', 'PK-HRM-105', 'VP Corporate Partnerships', 'Sales & Marketing', 'October 2026', 310000, 30000, 30000, 370000, 34000, 12000, 324000, 'Paid', '2026-10-01', 'MCB Bank - 998822334411');
