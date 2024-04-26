using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Entities;

namespace AnotherBlogSite.Application.Services;

public interface ICommentService
{
    Task<Result<CommentModel>> CreateAsync(Guid authorId, Guid blogPostId, string content);
    Task<Result<CommentModel>> UpdateAsync(Guid commentId, string newContent);
    Task DeleteAsync(Guid commentId);
}