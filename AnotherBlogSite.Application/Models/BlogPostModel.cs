namespace AnotherBlogSite.Application.Entities;

public sealed class BlogPostModel
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTimeOffset CreatedDate { get; set; }

    public Guid AuthorId { get; set; }
    public UserModel Author { get; set; }

    public ICollection<CommentModel> Comments { get; set; }
}
