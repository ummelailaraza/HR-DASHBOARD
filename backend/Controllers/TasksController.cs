using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrmApi.Data;
using HrmApi.Models;

namespace HrmApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly HrmDbContext _context;

        public TasksController(HrmDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            return await _context.TaskItems.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            if (string.IsNullOrEmpty(task.Id))
            {
                task.Id = $"task-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            }
            if (string.IsNullOrEmpty(task.CreatedAt))
            {
                task.CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd");
            }

            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] TaskStatusUpdate update)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null) return NotFound();

            if (!string.IsNullOrEmpty(update.Status))
            {
                task.Status = update.Status;
                if (update.Status == "Done") task.Progress = 100;
            }
            if (update.Progress.HasValue)
            {
                task.Progress = update.Progress.Value;
            }

            await _context.SaveChangesAsync();
            return Ok(task);
        }
    }

    public class TaskStatusUpdate
    {
        public string? Status { get; set; }
        public int? Progress { get; set; }
    }
}
