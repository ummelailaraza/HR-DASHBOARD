using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrmApi.Data;
using HrmApi.Models;

namespace HrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly HrmDbContext _context;

        public AttendanceController(HrmDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttendanceRecord>>> GetAttendance([FromQuery] string? date)
        {
            var query = _context.AttendanceRecords.AsQueryable();
            if (!string.IsNullOrEmpty(date))
            {
                query = query.Where(a => a.Date == date);
            }
            return await query.OrderByDescending(a => a.Date).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<AttendanceRecord>> MarkAttendance(AttendanceRecord record)
        {
            if (string.IsNullOrEmpty(record.Id))
            {
                record.Id = $"att-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }
            if (string.IsNullOrEmpty(record.Date))
            {
                record.Date = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }

            _context.AttendanceRecords.Add(record);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAttendance), new { id = record.Id }, record);
        }

        [HttpPost("{id}/clockout")]
        public async Task<IActionResult> ClockOut(string id, [FromBody] ClockOutRequest request)
        {
            var record = await _context.AttendanceRecords.FindAsync(id);
            if (record == null) return NotFound();

            record.ClockOut = request.ClockOut ?? DateTime.UtcNow.ToString("hh:mm tt");
            record.WorkDuration = "8h 15m";

            await _context.SaveChangesAsync();
            return Ok(record);
        }
    }

    public class ClockOutRequest
    {
        public string? ClockOut { get; set; }
    }
}
