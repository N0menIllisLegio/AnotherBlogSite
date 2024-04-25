using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Models;

namespace AnotherBlogSite.Application.Repositories;

public interface ICommentsRepository
{
    Task<Result<Comment>> CreateAsync(Comment newComment);
    Task<Result<Comment>> UpdateAsync(Comment updatedComment);
    Task DeleteAsync(Guid commentId);
}