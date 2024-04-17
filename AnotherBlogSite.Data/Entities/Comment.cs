namespace AnotherBlogSite.Data.Entities;

public sealed class Comment
{
    public Guid Id { get; set; }
    public Guid BlogPostId { get; set; }
    public string Content { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
}
