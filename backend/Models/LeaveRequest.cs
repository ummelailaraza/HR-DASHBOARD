using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrmApi.Models
{
    [Table("leave_requests")]
    public class LeaveRequest
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("employee_id")]
        public string EmployeeId { get; set; } = string.Empty;

        [Column("employee_name")]
        public string EmployeeName { get; set; } = string.Empty;

        [Column("employee_code")]
        public string EmployeeCode { get; set; } = string.Empty;

        [Column("department")]
        public string Department { get; set; } = string.Empty;

        [Column("leave_type")]
        public string LeaveType { get; set; } = "Casual";

        [Column("start_date")]
        public string StartDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        [Column("end_date")]
        public string EndDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        [Column("total_days")]
        public int TotalDays { get; set; } = 1;

        [Column("reason")]
        public string Reason { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = "Pending";

        [Column("applied_at")]
        public string AppliedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        [Column("approved_by")]
        public string? ApprovedBy { get; set; }

        [Column("manager_comments")]
        public string? ManagerComments { get; set; }
    }
}
