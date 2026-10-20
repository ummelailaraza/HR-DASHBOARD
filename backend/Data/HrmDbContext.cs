using Microsoft.EntityFrameworkCore;
using HrmApi.Models;

namespace HrmApi.Data
{
    public class HrmDbContext : DbContext
    {
        public HrmDbContext(DbContextOptions<HrmDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; } = null!;
        public DbSet<TaskItem> TaskItems { get; set; } = null!;
        public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
        public DbSet<PayrollRecord> PayrollRecords { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Employee>().HasIndex(e => e.EmployeeCode).IsUnique();
            modelBuilder.Entity<Employee>().HasIndex(e => e.Email).IsUnique();
            modelBuilder.Entity<Employee>().HasIndex(e => e.Cnic).IsUnique();
        }
    }
}
