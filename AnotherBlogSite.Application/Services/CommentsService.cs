using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Application.Repositories;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Services;

internal sealed class CommentsService: ICommentService
{
    private readonly ICommentsRepository _commentsRepository;

    public CommentsService(ICommentsRepository commentsRepository)
    {
        _commentsRepository = commentsRepository;
    }

    public Task<List<Comment>> GetAllBlogPostCommentsAsync(Guid blogPostId)
    {
        return _commentsRepository.GetAllBlogPostCommentsAsync(blogPostId);
    }

    public Task<Result<Guid>> CreateAsync(Guid authorId, Guid blogPostId, string content)
    {
        var comment = new Comment()
        {
            AuthorId = authorId,
            BlogPostId = blogPostId,
            Content = content,
            CreatedDate = DateTimeOffset.Now,
        };

        return _commentsRepository.CreateAsync(comment);
    }

    public Task<EmptyResult> UpdateAsync(Guid commentId, string newContent)
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
