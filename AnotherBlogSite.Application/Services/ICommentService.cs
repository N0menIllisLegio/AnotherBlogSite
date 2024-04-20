using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Services;

public interface ICommentService
{
    Task<List<Comment>> GetAllBlogPostCommentsAsync(Guid blogPostId);
    Task<Result<Guid>> CreateAsync(Guid authorId, Guid blogPostId, string content);
    Task<EmptyResult> UpdateAsync(Guid commentId, string newContent);
    Task DeleteAsync(Guid commentId);
}