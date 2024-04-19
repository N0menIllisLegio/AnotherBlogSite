namespace AnotherBlogSite.Domain.Entities;

public sealed class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTimeOffset CreatedDate { get; set; }
    
    public User Author { get; set; }
    public BlogPost BlogPost { get; set; }
}
