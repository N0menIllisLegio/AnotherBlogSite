using System.ComponentModel.DataAnnotations;

namespace AnotherBlogSite.Presentation.Models;

public sealed class BlogPostCreateRequest
{
    [Required]
    [MinLength(10)]
    [MaxLength(255)]
    public string Title { get; set; }

    [Required]
    [MinLength(500)]
    public string Content { get; set; }
}
