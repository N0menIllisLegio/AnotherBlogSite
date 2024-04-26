using AnotherBlogSite.Application.Entities;
using Riok.Mapperly.Abstractions;
using DataComment = AnotherBlogSite.Data.Entities.Comment;

namespace AnotherBlogSite.Application.Mapper;

[Mapper]
internal sealed partial class CommentMapper
{
    [MapperIgnoreSource(nameof(DataComment.BlogPost))]
    public partial CommentModel Map(DataComment comments);
}
