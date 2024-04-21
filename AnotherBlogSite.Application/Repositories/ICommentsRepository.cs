using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Repositories;

public interface ICommentsRepository
{
    Task<List<Comment>> GetAllBlogPostCommentsAsync(Guid blogPostId);
    Task<Result<Comment>> CreateAsync(Comment newComment);
    Task<Result<Comment>> UpdateAsync(Comment updatedComment);
    Task DeleteAsync(Guid commentId);
}