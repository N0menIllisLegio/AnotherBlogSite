using Riok.Mapperly.Abstractions;

using DomainComment = AnotherBlogSite.Domain.Entities.Comment;
using InfrastructureComment = AnotherBlogSite.Infrastructure.Entities.Comment;

namespace AnotherBlogSite.Infrastructure.Mapper;

[Mapper]
internal sealed partial class CommentMapper
{
    public partial DomainComment MapToDomain(InfrastructureComment comments);

    [MapperIgnoreTarget(nameof(InfrastructureComment.Author))]
    [MapperIgnoreSource(nameof(DomainComment.Author))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.BlogPost))]
    public partial InfrastructureComment MapToInfrastructure(DomainComment comment);

    [MapperIgnoreSource(nameof(DomainComment.Id))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.Id))]
    [MapperIgnoreSource(nameof(DomainComment.CreatedDate))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.CreatedDate))]
    [MapperIgnoreSource(nameof(DomainComment.Author))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.Author))]
    [MapperIgnoreSource(nameof(DomainComment.AuthorId))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.AuthorId))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.BlogPost))]
    [MapperIgnoreSource(nameof(DomainComment.BlogPostId))]
    [MapperIgnoreTarget(nameof(InfrastructureComment.BlogPostId))]
    public partial void Map(DomainComment updatedComment, InfrastructureComment originalComment);
}
