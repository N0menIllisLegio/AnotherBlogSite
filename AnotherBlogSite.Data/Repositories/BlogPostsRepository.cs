using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Application.Repositories;
using AnotherBlogSite.Data.Mapper;
using Microsoft.EntityFrameworkCore;

using DomainBlogPost = AnotherBlogSite.Application.Entities.BlogPost;

namespace AnotherBlogSite.Data.Repositories;

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
        return _mapper.ProjectToDomain(_context.BlogPosts.Include(x => x.Author).AsNoTracking()).ToListAsync();
    }

    public async Task<Result<DomainBlogPost>> GetAsync(Guid blogPostId)
    {
        var blogPost = await _context.BlogPosts
            .Include(x => x.Author)
            .Include(x => x.Comments)
                .ThenInclude(x => x.Author)
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == blogPostId);

        if (blogPost is null)
            return Result<DomainBlogPost>.CreateFailure("Blog Post not found!", ErrorType.NotFound);

        return Result<DomainBlogPost>.CreateSuccess(_mapper.MapToDomainWithComments(blogPost));
    }

    public async Task<Result<DomainBlogPost>> CreateAsync(DomainBlogPost newBlogPost)
    {
        var blogPost = _mapper.MapToInfrastructure(newBlogPost);

        _context.BlogPosts.Add(blogPost);

        int createdCount = await _context.SaveChangesAsync();

        if (createdCount != 1)
            return Result<DomainBlogPost>.CreateFailure("Failed to create Blog Post!");

        await _context.Entry(blogPost).Reference(x => x.Author).LoadAsync();

        return Result<DomainBlogPost>.CreateSuccess(
            _mapper.MapToDomainWithoutComments(blogPost));
    }

    public async Task<Result<DomainBlogPost>> UpdateAsync(DomainBlogPost updatedBlogPost)
    {
        var originalBlogPost = await _context.BlogPosts
            .Include(x => x.Author)
            .Include(x => x.Comments)
            .SingleOrDefaultAsync(x => x.Id == updatedBlogPost.Id);

        if (originalBlogPost is null)
            return Result<DomainBlogPost>.CreateFailure("Blog Post not found!", ErrorType.NotFound);

        _mapper.Map(updatedBlogPost, originalBlogPost);

        await _context.SaveChangesAsync();

        return Result<DomainBlogPost>.CreateSuccess(
            _mapper.MapToDomainWithComments(originalBlogPost));
    }

    public Task DeleteAsync(Guid blogPostId)
    {
        return _context.BlogPosts.Where(x => x.Id == blogPostId).ExecuteDeleteAsync();
    }
}
