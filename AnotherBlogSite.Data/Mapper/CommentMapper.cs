using AnotherBlogSite.Data.Entities;
using Riok.Mapperly.Abstractions;

using DomainComment = AnotherBlogSite.Application.Entities.Comment;
using InfrastructureComment = AnotherBlogSite.Data.Entities.Comment;

namespace AnotherBlogSite.Data.Mapper;

[Mapper]
internal sealed partial class CommentMapper
{
    public partial DomainComment MapToDomain(Comment comments);

    [MapperIgnoreTarget(nameof(Comment.Author))]
    [MapperIgnoreSource(nameof(DomainComment.Author))]
    [MapperIgnoreTarget(nameof(Comment.BlogPost))]
    public partial Comment MapToInfrastructure(DomainComment comment);

    [MapperIgnoreSource(nameof(DomainComment.Id))]
    [MapperIgnoreTarget(nameof(Comment.Id))]
    [MapperIgnoreSource(nameof(DomainComment.CreatedDate))]
    [MapperIgnoreTarget(nameof(Comment.CreatedDate))]
    [MapperIgnoreSource(nameof(DomainComment.Author))]
    [MapperIgnoreTarget(nameof(Comment.Author))]
    [MapperIgnoreSource(nameof(DomainComment.AuthorId))]
    [MapperIgnoreTarget(nameof(Comment.AuthorId))]
    [MapperIgnoreTarget(nameof(Comment.BlogPost))]
    [MapperIgnoreSource(nameof(DomainComment.BlogPostId))]
    [MapperIgnoreTarget(nameof(Comment.BlogPostId))]
    public partial void Map(DomainComment updatedComment, Comment originalComment);
}
