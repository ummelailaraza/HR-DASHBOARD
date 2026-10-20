using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrmApi.Models
{
    [Table("attendance_records")]
    public class AttendanceRecord
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("employee_id")]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        [Column("employee_name")]
        public string EmployeeName { get; set; } = string.Empty;

        [Column("employee_code")]
        public string EmployeeCode { get; set; } = string.Empty;

        [Column("department")]
        public string Department { get; set; } = string.Empty;

        [Column("date")]
        public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        [Column("clock_in")]
        public string ClockIn { get; set; } = "09:00 AM";

        [Column("clock_out")]
        public string? ClockOut { get; set; }

        [Column("work_duration")]
        public string WorkDuration { get; set; } = "Current";

        [Column("status")]
        public string Status { get; set; } = "Present";

        [Column("work_mode")]
        public string WorkMode { get; set; } = "Office";

        [Column("location")]
        public string Location { get; set; } = "Lahore HQ - Floor 3";

        [Column("notes")]
        public string? Notes { get; set; }
    }
}
