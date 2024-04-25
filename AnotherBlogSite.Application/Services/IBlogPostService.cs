using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Models;

namespace AnotherBlogSite.Application.Services;

public interface IBlogPostService
{
    Task<List<BlogPost>> GetAllAsync();
    Task<Result<BlogPost>> GetAsync(Guid blogPostId);
    Task<Result<BlogPost>> CreateAsync(string title, string content, Guid authorId);
    Task<Result<BlogPost>> UpdateAsync(Guid blogPostId, string title, string content);
    Task DeleteAsync(Guid blogPostId);
}