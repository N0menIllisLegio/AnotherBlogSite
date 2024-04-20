using System.ComponentModel.DataAnnotations;

namespace AnotherBlogSite.Presentation.Models;

public sealed class CommentCreateRequest
{
    [Required]
    public Guid BlogPostId { get; set; }
    
    [Required]
    [MinLength(1)]
    public string Content { get; set; }
}
