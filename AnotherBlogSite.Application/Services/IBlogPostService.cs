using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Services;

public interface IBlogPostService
{
    Task<List<BlogPost>> GetAllAsync();
    Task<Result<BlogPost>> GetAsync(Guid blogPostId);
    Task<Result<Guid>> CreateAsync(string title, string content, Guid authorId);
    Task<EmptyResult> UpdateAsync(Guid blogPostId, string title, string content);
    Task DeleteAsync(Guid blogPostId);
}