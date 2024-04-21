using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Application.Repositories;
using AnotherBlogSite.Infrastructure.Mapper;
using Microsoft.EntityFrameworkCore;

using DomainComment = AnotherBlogSite.Domain.Entities.Comment;

namespace AnotherBlogSite.Infrastructure.Repositories;

internal sealed class CommentsRepository: ICommentsRepository
{
    private readonly CommentMapper _mapper = new();
    private readonly BlogSiteContext _context;

    public CommentsRepository(BlogSiteContext context)
    {
        _context = context;
    }

    public Task<List<DomainComment>> GetAllBlogPostCommentsAsync(Guid blogPostId)
    {
        return _mapper
            .ProjectToDomain(_context.Comments.Where(x => x.BlogPostId == blogPostId).AsNoTracking())
            .ToListAsync();
    }

    public async Task<Result<DomainComment>> CreateAsync(DomainComment newComment)
    {
        var comment = _mapper.MapToInfrastructure(newComment);

        _context.Comments.Add(comment);
        
        int createdCount = await _context.SaveChangesAsync();
        
        if (createdCount != 1)
            return Result<DomainComment>.CreateFailure("Failed to create Comment!");
        
        await _context.Entry(comment).Reference(x => x.Author).LoadAsync();

        return Result<DomainComment>.CreateSuccess(_mapper.MapToDomain(comment));
    }

    public async Task<Result<DomainComment>> UpdateAsync(DomainComment updatedComment)
    {
        var originalComment = await _context.Comments
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.Id == updatedComment.Id);

        if (originalComment is null)
            return Result<DomainComment>.CreateFailure("Comment not found!", ErrorType.NotFound);
        
        _mapper.Map(updatedComment, originalComment);

        await _context.SaveChangesAsync();

        return Result<DomainComment>.CreateSuccess(_mapper.MapToDomain(originalComment));
    }

    public Task DeleteAsync(Guid commentId)
    {
        return _context.Comments.Where(x => x.Id == commentId).ExecuteDeleteAsync();
    }
}
