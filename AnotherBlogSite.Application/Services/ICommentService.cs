using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Models;

namespace AnotherBlogSite.Application.Services;

public interface ICommentService
{
    Task<Result<Comment>> CreateAsync(Guid authorId, Guid blogPostId, string content);
    Task<Result<Comment>> UpdateAsync(Guid commentId, string newContent);
    Task DeleteAsync(Guid commentId);
}