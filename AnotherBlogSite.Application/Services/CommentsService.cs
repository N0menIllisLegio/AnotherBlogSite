using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Mapper;
using AnotherBlogSite.Data;
using AnotherBlogSite.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnotherBlogSite.Application.Services;

internal sealed class CommentsService: ICommentService
{
    private readonly CommentMapper _mapper = new();
    private readonly BlogSiteContext _context;

    public CommentsService(BlogSiteContext context)
    {
        _context = context;
    }

    public async Task<Result<CommentModel>> CreateAsync(Guid authorId, Guid blogPostId, string content)
    {
        var comment = new Comment()
        {
            AuthorId = authorId,
            BlogPostId = blogPostId,
            Content = content,
            CreatedDate = DateTimeOffset.UtcNow,
        };

        try
        {
            _context.Comments.Add(comment);

            int createdCount = await _context.SaveChangesAsync();

            if (createdCount != 1)
                return Result<CommentModel>.CreateFailure("Failed to create Comment!");

            await _context.Entry(comment).Reference(x => x.Author).LoadAsync();

            return Result<CommentModel>.CreateSuccess(_mapper.Map(comment));
        }
        catch (DbUpdateException)
        {
            return Result<CommentModel>.CreateFailure("Failed to update Comment!");
        }
    }

    public async Task<Result<CommentModel>> UpdateAsync(Guid commentId, string newContent)
    {
        var oldComment = await _context.Comments
            .Include(x => x.Author)
            .SingleOrDefaultAsync(x => x.Id == commentId);

        if (oldComment is null)
            return Result<CommentModel>.CreateFailure("Comment not found!", ErrorType.NotFound);

        oldComment.Content = newContent;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Result<CommentModel>.CreateFailure("Failed to update Comment!");
        }

        return Result<CommentModel>.CreateSuccess(_mapper.Map(oldComment));
    }

    public Task DeleteAsync(Guid commentId)
    {
        return _context.Comments.Where(x => x.Id == commentId).ExecuteDeleteAsync();
    }
}
