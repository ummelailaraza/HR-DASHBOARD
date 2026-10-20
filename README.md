# 🇵🇰 PakHRM Enterprise — Corporate Human Resource Management Portal

An enterprise-grade Human Resource Management (HRM) Portal built with **Next.js 14 (App Router, Tailwind CSS, TypeScript)**, **PostgreSQL (`hrm_db`)**, and an **ASP.NET Core 8 Web API Backend (`backend/`)**. 

Tailored specifically for Pakistani corporate operations with authentic scaffolding: Computerized National Identity Cards (**CNIC**), Pakistani mobile numbers (**+92 3xx**), major business hubs (**Lahore, Karachi, Islamabad**), **PKR** compensation structures, **FBR Section 149** tax withholding, and statutory leave policies.

---

## 📸 Key Capabilities

- **🔐 Dual Authentication & Onboarding**:
  - Corporate Credentials login or **1-Click Demo Persona Switcher** (CEO, HR Director, Lead Engineer, CFO).
  - Employee Onboarding (`/signup`) with CNIC validation (`xxxxx-xxxxxxx-x`) and corporate hub assignment.
- **🌓 Dark Mode / Light Mode**:
  - Seamless corporate navy & slate theme with instant toggle and `localStorage` persistence.
- **📊 Executive Dashboard (`/`)**:
  - Live Pakistan Standard Time (PKT) clock.
  - Interactive biometric Punch In / Punch Out duty status tracking.
  - Real-time headcount KPIs, attendance rates, pending leaves, and active task alerts.
- **👥 Employee Directory & 3-Tab Dossier (`/employees`)**:
  - Multi-attribute search, CSV roster export, and detailed profile dossiers (*Personal*, *Job Profile*, *PKR Compensation*).
- **⏱️ Attendance & Biometrics (`/attendance`)**:
  - On-time vs. late arrival detection (09:00 AM PKT grace period), daily attendance ledgers, and HR manual override modal.
- **📋 Task Delegation & Kanban Board (`/tasks`)**:
  - Interactive Kanban lanes (*Pending*, *In Progress*, *Completed*) with one-click progression and priority tags.
- **🏖️ Statutory Leave Governance (`/leaves`)**:
  - Pakistan statutory leave policy (14 Days Privilege, 10 Days Casual, 8 Days Paid Sick Leave).
  - Application modal with automated date calculations and 1-click Approve / Decline actions.
- **💰 Payroll, Tax & Payslip Generation (`/payroll`)**:
  - Basic pay, Medical, and Conveyance allowances.
  - **FBR Section 149** Income Tax Withholding & Employee Provident Fund deductions.
  - Batch disbursement simulator and official confidential salary slips ready for printing (`window.print()`).

---

## 🛠️ System Prerequisites for Another PC

Before installing on a new machine, ensure you have the following installed:

1. **Git**: [Download Git](https://git-scm.com/downloads)
2. **Node.js**: v18.17+ or v20+ LTS [Download Node.js](https://nodejs.org/)
3. **PostgreSQL**: v14, v15, v16, or v18 [Download PostgreSQL](https://www.postgresql.org/download/) *(or Docker)*
4. **.NET 8.0 SDK**: (Required to run the C# Web API backend) [Download .NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

---

## 🚀 Step-by-Step Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/HER_Laila/HRM.git
cd HRM
```

---

### Step 2: Set Up the PostgreSQL Database

#### Option A: Using Local PostgreSQL Installation
1. Open your terminal or `psql` shell:
   ```sql
   CREATE DATABASE hrm_db;
   ```
2. Populate the tables and authentic Pakistani seed records:
   - **Windows (PowerShell)**:
     ```powershell
     $env:PGPASSWORD="your_postgres_password"
     & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d hrm_db -f seed_postgres.sql
     ```
   - **macOS / Linux**:
     ```bash
     PGPASSWORD="your_postgres_password" psql -h localhost -U postgres -d hrm_db -f seed_postgres.sql
     ```

#### Option B: Using Docker (Fastest Option)
If you don't have PostgreSQL installed locally, run it via Docker in one command:
```bash
docker run --name hrm-postgres -e POSTGRES_PASSWORD=your_postgres_password -e POSTGRES_DB=hrm_db -p 5432:5432 -d postgres:16

# Once the container is running, seed the data:
docker cp seed_postgres.sql hrm-postgres:/seed_postgres.sql
docker exec -it hrm-postgres psql -U postgres -d hrm_db -f /seed_postgres.sql
```

---

### Step 3: Configure and Run the Backend (.NET 8 Web API)

1. Open `backend/appsettings.json` and verify the PostgreSQL connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=127.0.0.1;Port=5432;Database=hrm_db;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
   }
   ```
2. Navigate to the backend directory and launch the API:
   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```
3. The API will start at:
   - **API Root**: `http://localhost:5000`
   - **Swagger OpenAPI Docs**: `http://localhost:5000/swagger`

---

### Step 4: Configure and Run the Frontend (Next.js 14)

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   - **Development mode (with hot-reload)**:
     ```bash
     npm run dev
     ```
   - **Production mode (optimized build)**:
     ```bash
     npm run build
     npm start
     ```
4. Open your browser and navigate to:
   - **HRM Portal**: [http://localhost:3000](http://localhost:3000)
   - **Login Page**: [http://localhost:3000/login](http://localhost:3000/login)

---

## 🔑 Demo Personas & Login Credentials

On the **Login page (`/login`)**, you can either sign in with corporate credentials or click any of the **1-Click Demo Personas**:

| Name | Role | Email | Password |
|---|---|---|---|
| **Ummelaila Raza** | Chief Executive Officer (Admin) | `ummelaila.raza@corporate.pk` | `Admin@1234` |
| **Fatima Zahra** | Director of Human Resources | `fatima.zahra@enterprise.com.pk` | `admin123` |
| **Usman Tariq** | Lead Full Stack Engineer | `usman.tariq@enterprise.com.pk` | `admin123` |
| **Ayesha Siddiqui** | Chief Financial Officer | `ayesha.siddiqui@enterprise.com.pk` | `admin123` |

---

## 📁 Repository Structure

```text
HRM/
├── backend/                       # ASP.NET Core 8 Web API
│   ├── Controllers/               # REST Endpoints (Employees, Attendance, Tasks, Leaves, Payroll, Dashboard)
│   ├── Data/                      # EF Core DbContext & Database Initializer
│   ├── Models/                    # Entity Models (Employee, Attendance, Task, Leave, Payroll)
│   ├── appsettings.json           # Database connection configuration
│   ├── HrmApi.csproj              # Project configuration & NuGet dependencies
│   └── Program.cs                 # ASP.NET application startup & CORS config
├── frontend/                      # Next.js 14 App Router
│   ├── src/
│   │   ├── app/                   # Next.js routes (/, /login, /signup, /employees, /attendance, /tasks, /leaves, /payroll)
│   │   ├── components/            # Header, Sidebar, StatCard, Badge, Modal, AppShell
│   │   ├── context/               # AuthContext, ThemeContext, ToastContext
│   │   └── lib/                   # API client layer (api.ts) & TypeScript interfaces (types.ts)
│   ├── tailwind.config.ts         # Dark mode configuration & custom animations
│   ├── package.json               # Node.js dependencies
│   └── tsconfig.json              # TypeScript configuration
├── seed_postgres.sql              # Schema creation & authentic Pakistani data seed
├── .gitignore                     # Git ignore rules
└── README.md                      # Comprehensive project guide
```

---

## 💡 Dual-Mode Architecture (Client Resiliency)

The frontend's API client (`frontend/src/lib/api.ts`) is designed with resilience:
- **Connected Mode**: When the .NET backend is active on port `5000`, all operations query and persist directly to the PostgreSQL database.
- **Standalone Mode**: If the .NET backend is temporarily stopped, the frontend provides intelligent local persistence loaded with Pakistani employee data so developers and stakeholders can test all UI workflows, biometric punches, leave approvals, and printable payslips without interruption.

---

## 🙏 Ownership
Created  and maintained by Ummelaila Raza.

---
