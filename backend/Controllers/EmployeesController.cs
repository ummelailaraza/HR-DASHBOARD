using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrmApi.Data;
using HrmApi.Models;

namespace HrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly HrmDbContext _context;

        public EmployeesController(HrmDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.OrderByDescending(e => e.JoiningDate).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(string id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();
            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            if (string.IsNullOrEmpty(employee.Id))
            {
                employee.Id = $"emp-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }
            if (string.IsNullOrEmpty(employee.EmployeeCode))
            {
                employee.EmployeeCode = $"PK-HRM-{new Random().Next(100, 999)}";
            }
            employee.FullName = $"{employee.FirstName} {employee.LastName}".Trim();
            employee.NetSalary = employee.BasicSalary + employee.Allowances - employee.TaxDeductions;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(string id, Employee employee)
        {
            var existing = await _context.Employees.FindAsync(id);
            if (existing == null) return NotFound();

            existing.FirstName = employee.FirstName;
            existing.LastName = employee.LastName;
            existing.FullName = $"{employee.FirstName} {employee.LastName}".Trim();
            existing.Email = employee.Email;
            existing.Phone = employee.Phone;
            existing.Cnic = employee.Cnic;
            existing.Department = employee.Department;
            existing.Designation = employee.Designation;
            existing.BasicSalary = employee.BasicSalary;
            existing.Allowances = employee.Allowances;
            existing.TaxDeductions = employee.TaxDeductions;
            existing.NetSalary = employee.BasicSalary + employee.Allowances - employee.TaxDeductions;
            existing.City = employee.City;
            existing.Address = employee.Address;
            existing.Status = employee.Status;
            existing.EmploymentType = employee.EmploymentType;
            existing.BankAccount = employee.BankAccount;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
