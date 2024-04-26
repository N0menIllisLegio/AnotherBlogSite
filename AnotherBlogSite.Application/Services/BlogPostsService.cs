using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Common;
using AnotherBlogSite.Data;
using AnotherBlogSite.Data.Entities;
using Microsoft.EntityFrameworkCore;
using BlogPostMapper = AnotherBlogSite.Application.Mapper.BlogPostMapper;

namespace AnotherBlogSite.Application.Services;

internal sealed class BlogPostsService: IBlogPostService
{
    private readonly BlogPostMapper _mapper = new();
    private readonly BlogSiteContext _context;

    public BlogPostsService(BlogSiteContext context)
    {
        _context = context;
    }

    public Task<List<BlogPostModel>> GetAllAsync()
    {
        return _mapper.ProjectToModel(_context.BlogPosts.Include(x => x.Author).AsNoTracking()).ToListAsync();
    }

    public async Task<Result<BlogPostModel>> GetAsync(Guid blogPostId)
    {
        var blogPost = await _context.BlogPosts
            .AsNoTracking()
            .Include(x => x.Author)
            .Include(x => x.Comments)
                .ThenInclude(x => x.Author)
            .SingleOrDefaultAsync(x => x.Id == blogPostId);

        if (blogPost is null)
            return Result<BlogPostModel>.CreateFailure("Blog Post not found!", ErrorType.NotFound);

        return Result<BlogPostModel>.CreateSuccess(_mapper.MapWithComments(blogPost));
    }

    public async Task<Result<BlogPostModel>> CreateAsync(string title, string content, Guid authorId)
    {
        var newBlogPost = new BlogPost()
        {
            Title = title,
            AuthorId = authorId,
            Content = content,
            CreatedDate = DateTimeOffset.UtcNow,
        };

        try
        {
            _context.BlogPosts.Add(newBlogPost);

            int createdCount = await _context.SaveChangesAsync();

            if (createdCount != 1)
                return Result<BlogPostModel>.CreateFailure("Failed to create Blog Post!");

            await _context.Entry(newBlogPost).Reference(x => x.Author).LoadAsync();

            return Result<BlogPostModel>.CreateSuccess(_mapper.MapWithoutComments(newBlogPost));
        }
        catch (DbUpdateException)
        {
            return Result<BlogPostModel>.CreateFailure("Failed to update Blog Post!");
        }
    }

    public async Task<Result<BlogPostModel>> UpdateAsync(Guid blogPostId, string title, string content)
    {
        var oldBlogPost = await _context.BlogPosts
            .Include(x => x.Author)
            .Include(x => x.Comments)
                .ThenInclude(x => x.Author)
            .SingleOrDefaultAsync(x => x.Id == blogPostId);

        if (oldBlogPost is null)
            return Result<BlogPostModel>.CreateFailure("Blog Post not found!", ErrorType.NotFound);

        oldBlogPost.Title = title;
        oldBlogPost.Content = content;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Result<BlogPostModel>.CreateFailure("Failed to update Comment!");
        }

        return Result<BlogPostModel>.CreateSuccess(_mapper.MapWithComments(oldBlogPost));
    }

    public Task DeleteAsync(Guid blogPostId)
    {
        return _context.BlogPosts.Where(x => x.Id == blogPostId).ExecuteDeleteAsync();
    }
}
