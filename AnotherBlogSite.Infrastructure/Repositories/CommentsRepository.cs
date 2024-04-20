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
        return _mapper.ProjectToDomain(_context.Comments.Where(x => x.BlogPostId == blogPostId)).ToListAsync();
    }

    public async Task<Result<Guid>> CreateAsync(DomainComment newComment)
    {
        var comment = _mapper.MapToInfrastructure(newComment);

        _context.Comments.Add(comment);
        
        int createdCount = await _context.SaveChangesAsync();
        
        if (createdCount != 1)
            return Result<Guid>.CreateFailure("Failed to create Comment!");

        return Result<Guid>.CreateSuccess(comment.Id);
    }

    public async Task<EmptyResult> UpdateAsync(DomainComment updatedComment)
    {
        var originalComment = await _context.Comments.FirstOrDefaultAsync(x => x.Id == updatedComment.Id);

        if (originalComment is null)
            return Result<DomainComment>.CreateFailure("Comment not found!", ErrorType.NotFound);
        
        _mapper.Map(updatedComment, originalComment);

        int updatedCount = await _context.SaveChangesAsync();

        if (updatedCount == 1)
            return EmptyResult.CreateSuccess();

        return EmptyResult.CreateFailure("Failed to update Comment!");
    }

    public Task DeleteAsync(Guid commentId)
    {
        return _context.Comments.Where(x => x.Id == commentId).ExecuteDeleteAsync();
    }
}
