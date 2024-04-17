namespace AnotherBlogSite.Data.Entities;

public sealed class BlogPost
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
}
