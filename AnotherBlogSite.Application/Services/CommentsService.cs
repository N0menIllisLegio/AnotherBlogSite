using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Application.Repositories;

namespace AnotherBlogSite.Application.Services;

internal sealed class CommentsService: ICommentService
{
    private readonly ICommentsRepository _commentsRepository;

    public CommentsService(ICommentsRepository commentsRepository)
    {
        _commentsRepository = commentsRepository;
    }

    public Task<Result<Comment>> CreateAsync(Guid authorId, Guid blogPostId, string content)
    {
        var comment = new Comment()
        {
            AuthorId = authorId,
            BlogPostId = blogPostId,
            Content = content,
            CreatedDate = DateTimeOffset.UtcNow,
        };

        return _commentsRepository.CreateAsync(comment);
    }

    public Task<Result<Comment>> UpdateAsync(Guid commentId, string newContent)
    {
        var comment = new Comment()
        {
            Id = commentId,
            Content = newContent,
        };

        return _commentsRepository.UpdateAsync(comment);
    }

    public Task DeleteAsync(Guid commentId)
    {
        return _commentsRepository.DeleteAsync(commentId);
    }
}
