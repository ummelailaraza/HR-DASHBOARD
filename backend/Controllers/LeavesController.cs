using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrmApi.Data;
using HrmApi.Models;

namespace HrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeavesController : ControllerBase
    {
        private readonly HrmDbContext _context;

        public LeavesController(HrmDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaves()
        {
            return await _context.LeaveRequests.OrderByDescending(l => l.AppliedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<LeaveRequest>> CreateLeave(LeaveRequest leave)
        {
            if (string.IsNullOrEmpty(leave.Id))
            {
                leave.Id = $"leave-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }
            if (string.IsNullOrEmpty(leave.AppliedAt))
            {
                leave.AppliedAt = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }
            leave.Status = "Pending";

            _context.LeaveRequests.Add(leave);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLeaves), new { id = leave.Id }, leave);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateLeaveStatus(string id, [FromBody] LeaveStatusUpdate update)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null) return NotFound();

            if (!string.IsNullOrEmpty(update.Status))
            {
                leave.Status = update.Status;
                leave.ApprovedBy = "Executive HR Management";
            }
            if (!string.IsNullOrEmpty(update.Comments))
            {
                leave.ManagerComments = update.Comments;
            }

            await _context.SaveChangesAsync();
            return Ok(leave);
        }
    }

    public class LeaveStatusUpdate
    {
        public string? Status { get; set; }
        public string? Comments { get; set; }
    }
}
