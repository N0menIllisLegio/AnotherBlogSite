using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Common;

namespace AnotherBlogSite.Application.Services;

public interface IBlogPostService
{
    Task<List<BlogPostModel>> GetAllAsync();
    Task<Result<BlogPostModel>> GetAsync(Guid blogPostId);
    Task<Result<BlogPostModel>> CreateAsync(string title, string content, Guid authorId);
    Task<Result<BlogPostModel>> UpdateAsync(Guid blogPostId, string title, string content);
    Task DeleteAsync(Guid blogPostId);
}