using System.ComponentModel.DataAnnotations;

namespace AnotherBlogSite.Presentation.Models;

public sealed class BlogPostCreateRequest
{
    [Required]
    [MinLength(10)]
    public string Title { get; set; }
    
    [Required]
    [MinLength(100)]
    public string Content { get; set; }
}
