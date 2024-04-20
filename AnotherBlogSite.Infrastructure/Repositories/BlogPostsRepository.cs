using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Application.Repositories;
using AnotherBlogSite.Infrastructure.Mapper;
using Microsoft.EntityFrameworkCore;

using DomainBlogPost = AnotherBlogSite.Domain.Entities.BlogPost;

namespace AnotherBlogSite.Infrastructure.Repositories;

internal sealed class BlogPostsRepository: IBlogPostsRepository
{
    private readonly BlogPostMapper _mapper = new();
    
    private readonly BlogSiteContext _context;

    public BlogPostsRepository(BlogSiteContext context)
    {
        _context = context;
    }

    public Task<List<DomainBlogPost>> GetAllAsync()
    {
        return _mapper.ProjectToDomain(_context.BlogPosts).ToListAsync();
    }

    public async Task<Result<DomainBlogPost>> GetAsync(Guid blogPostId)
    {
        var blogPost = await _context.BlogPosts
            .Include(x => x.Author)
            .Include(x => x.Comments)
            .FirstOrDefaultAsync(x => x.Id == blogPostId);

        if (blogPost is null)
            return Result<DomainBlogPost>.CreateFailure("Blog Post not found!", ErrorType.NotFound);

        return Result<DomainBlogPost>.CreateSuccess(_mapper.MapToDomain(blogPost));
    }

    public async Task<Result<Guid>> CreateAsync(DomainBlogPost newBlogPost)
    {
        var blogPost = _mapper.MapToInfrastructure(newBlogPost);

        _context.BlogPosts.Add(blogPost);
        
        int createdCount = await _context.SaveChangesAsync();
        
        if (createdCount != 1)
            return Result<Guid>.CreateFailure("Failed to create Blog Post!");

        return Result<Guid>.CreateSuccess(blogPost.Id);
    }

    public async Task<EmptyResult> UpdateAsync(DomainBlogPost updatedBlogPost)
    {
        var originalBlogPost = await _context.BlogPosts.FirstOrDefaultAsync(x => x.Id == updatedBlogPost.Id);

        if (originalBlogPost is null)
            return Result<DomainBlogPost>.CreateFailure("Blog Post not found!", ErrorType.NotFound);
        
        _mapper.Map(updatedBlogPost, originalBlogPost);

        int updatedCount = await _context.SaveChangesAsync();

        if (updatedCount == 1)
            return EmptyResult.CreateSuccess();

        return EmptyResult.CreateFailure("Failed to update Blog Post!");
    }

    public Task DeleteAsync(Guid blogPostId)
    {
        return _context.BlogPosts.Where(x => x.Id == blogPostId).ExecuteDeleteAsync();
    }
}
