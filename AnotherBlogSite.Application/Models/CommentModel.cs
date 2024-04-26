namespace AnotherBlogSite.Application.Entities;

public sealed class CommentModel
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTimeOffset CreatedDate { get; set; }

    public Guid AuthorId { get; set; }
    public UserModel Author { get; set; }
    public Guid BlogPostId { get; set; }
}
