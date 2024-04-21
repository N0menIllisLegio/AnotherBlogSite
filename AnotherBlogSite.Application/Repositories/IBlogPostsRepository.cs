using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Repositories;

public interface IBlogPostsRepository
{
    Task<List<BlogPost>> GetAllAsync();
    Task<Result<BlogPost>> GetAsync(Guid blogPostId);
    Task<Result<BlogPost>> CreateAsync(BlogPost newBlogPost);
    Task<Result<BlogPost>> UpdateAsync(BlogPost updatedBlogPost);
    Task DeleteAsync(Guid blogPostId);
}