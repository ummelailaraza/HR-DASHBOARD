using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrmApi.Data;
using HrmApi.Models;

namespace HrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayrollController : ControllerBase
    {
        private readonly HrmDbContext _context;

        public PayrollController(HrmDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayrollRecord>>> GetPayroll()
        {
            return await _context.PayrollRecords.OrderByDescending(p => p.Month).ToListAsync();
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayroll([FromBody] PayrollProcessRequest request)
        {
            if (request.Records != null && request.Records.Any())
            {
                foreach (var rec in request.Records)
                {
                    if (string.IsNullOrEmpty(rec.Id))
                    {
                        rec.Id = $"pay-{rec.EmployeeId}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
                    }
                    _context.PayrollRecords.Add(rec);
                }
                await _context.SaveChangesAsync();
            }
            return Ok(new { message = $"Payroll processed successfully for {request.Month}" });
        }
    }

    public class PayrollProcessRequest
    {
        public string Month { get; set; } = string.Empty;
        public List<PayrollRecord>? Records { get; set; }
    }
}
