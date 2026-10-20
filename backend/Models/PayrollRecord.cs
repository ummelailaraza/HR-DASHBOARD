using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrmApi.Models
{
    [Table("payroll_records")]
    public class PayrollRecord
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

        [Column("designation")]
        public string Designation { get; set; } = string.Empty;

        [Column("department")]
        public string Department { get; set; } = string.Empty;

        [Column("month")]
        public string Month { get; set; } = DateTime.UtcNow.ToString("MMMM yyyy");

        [Column("basic_salary")]
        public decimal BasicSalary { get; set; }

        [Column("medical_allowance")]
        public decimal MedicalAllowance { get; set; }

        [Column("conveyance_allowance")]
        public decimal ConveyanceAllowance { get; set; }

        [Column("gross_salary")]
        public decimal GrossSalary { get; set; }

        [Column("tax_deduction")]
        public decimal TaxDeduction { get; set; }

        [Column("provident_fund")]
        public decimal ProvidentFund { get; set; }

        [Column("net_salary")]
        public decimal NetSalary { get; set; }

        [Column("payment_status")]
        public string PaymentStatus { get; set; } = "Paid";

        [Column("payment_date")]
        public string? PaymentDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

        [Column("bank_account")]
        public string BankAccount { get; set; } = string.Empty;
    }
}
