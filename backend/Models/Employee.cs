using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrmApi.Models
{
    [Table("employees")]
    public class Employee
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("employee_code")]
        public string EmployeeCode { get; set; } = string.Empty;

        [Required]
        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [Column("cnic")]
        public string Cnic { get; set; } = string.Empty;

        [Required]
        [Column("department")]
        public string Department { get; set; } = string.Empty;

        [Required]
        [Column("designation")]
        public string Designation { get; set; } = string.Empty;

        [Column("joining_date")]
        public string JoiningDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        [Column("status")]
        public string Status { get; set; } = "Active";

        [Column("employment_type")]
        public string EmploymentType { get; set; } = "Full-Time";

        [Column("basic_salary")]
        public decimal BasicSalary { get; set; }

        [Column("allowances")]
        public decimal Allowances { get; set; }

        [Column("tax_deductions")]
        public decimal TaxDeductions { get; set; }

        [Column("net_salary")]
        public decimal NetSalary { get; set; }

        [Column("city")]
        public string City { get; set; } = "Lahore";

        [Column("address")]
        public string Address { get; set; } = string.Empty;

        [Column("avatar_url")]
        public string AvatarUrl { get; set; } = string.Empty;

        [Column("emergency_contact")]
        public string EmergencyContact { get; set; } = string.Empty;

        [Column("bank_account")]
        public string BankAccount { get; set; } = string.Empty;
    }
}
