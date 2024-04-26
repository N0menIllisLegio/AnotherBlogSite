using AnotherBlogSite.Application.Entities;
using Riok.Mapperly.Abstractions;
using DataBlogPost = AnotherBlogSite.Data.Entities.BlogPost;

namespace AnotherBlogSite.Application.Mapper;

[Mapper]
internal sealed partial class BlogPostMapper
{
    public partial IQueryable<BlogPostModel> ProjectToModel(IQueryable<DataBlogPost> blogPosts);

    [MapperIgnoreSource(nameof(DataBlogPost.Comments))]
    [MapperIgnoreTarget(nameof(BlogPostModel.Comments))]
    public partial BlogPostModel MapWithoutComments(DataBlogPost blogPost);

    public partial BlogPostModel MapWithComments(DataBlogPost blogPost);
}
