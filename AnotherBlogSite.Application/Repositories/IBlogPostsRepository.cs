using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Repositories;

public interface IBlogPostsRepository
{
    Task<List<BlogPost>> GetAllAsync();
    Task<Result<BlogPost>> GetAsync(Guid blogPostId);
    Task<Result<Guid>> CreateAsync(BlogPost newBlogPost);
    Task<EmptyResult> UpdateAsync(BlogPost updatedBlogPost);
    Task DeleteAsync(Guid blogPostId);
}