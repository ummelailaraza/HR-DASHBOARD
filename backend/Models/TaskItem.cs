using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrmApi.Models
{
    [Table("task_items")]
    public class TaskItem
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("assignee_id")]
        public string AssigneeId { get; set; } = string.Empty;

        [Column("assignee_name")]
        public string AssigneeName { get; set; } = string.Empty;

        [Column("assignee_avatar")]
        public string AssigneeAvatar { get; set; } = string.Empty;

        [Column("assignee_role")]
        public string AssigneeRole { get; set; } = string.Empty;

        [Column("department")]
        public string Department { get; set; } = string.Empty;

        [Column("priority")]
        public string Priority { get; set; } = "Medium";

        [Column("status")]
        public string Status { get; set; } = "Todo";

        [Column("due_date")]
        public string DueDate { get; set; } = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd");

        [Column("progress")]
        public int Progress { get; set; } = 0;

        [Column("created_at")]
        public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    }
}
