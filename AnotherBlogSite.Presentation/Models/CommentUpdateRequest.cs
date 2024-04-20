using System.ComponentModel.DataAnnotations;

namespace AnotherBlogSite.Presentation.Models;

public sealed class CommentUpdateRequest
{
    [Required]
    public Guid CommentId { get; set; }
    
    [Required]
    [MinLength(1)]
    public string Content { get; set; }
}
