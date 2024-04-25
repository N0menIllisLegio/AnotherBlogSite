using AnotherBlogSite.Data.Entities;
using Riok.Mapperly.Abstractions;

using DomainBlogPost = AnotherBlogSite.Application.Entities.BlogPost;
using InfrastructureBlogPost = AnotherBlogSite.Data.Entities.BlogPost;

namespace AnotherBlogSite.Data.Mapper;

[Mapper]
internal sealed partial class BlogPostMapper
{
    [MapProperty(nameof(BlogPost.Content), nameof(DomainBlogPost.Content), Use = nameof(TruncateContent))]
    [MapperIgnoreSource(nameof(BlogPost.Comments))]
    [MapperIgnoreTarget(nameof(DomainBlogPost.Comments))]
    public partial DomainBlogPost MapToDomainTruncated(BlogPost blogPosts);

    [UserMapping(Default = false)]
    private string TruncateContent(string content) => content.Substring(0, 350);

    [MapProperty(nameof(BlogPost.Content), nameof(DomainBlogPost.Content), Use = nameof(TruncateContent))]
    public partial IQueryable<DomainBlogPost> ProjectToDomain(IQueryable<BlogPost> blogPosts);

    [MapperIgnoreSource(nameof(BlogPost.Comments))]
    [MapperIgnoreTarget(nameof(DomainBlogPost.Comments))]
    public partial DomainBlogPost MapToDomainWithoutComments(BlogPost blogPost);

    public partial DomainBlogPost MapToDomainWithComments(BlogPost blogPost);

    [MapperIgnoreTarget(nameof(BlogPost.Author))]
    [MapperIgnoreSource(nameof(DomainBlogPost.Author))]
    [MapperIgnoreTarget(nameof(BlogPost.Comments))]
    [MapperIgnoreSource(nameof(DomainBlogPost.Comments))]
    public partial BlogPost MapToInfrastructure(DomainBlogPost blogPost);

    [MapperIgnoreSource(nameof(DomainBlogPost.Id))]
    [MapperIgnoreTarget(nameof(BlogPost.Id))]
    [MapperIgnoreSource(nameof(DomainBlogPost.CreatedDate))]
    [MapperIgnoreTarget(nameof(BlogPost.CreatedDate))]
    [MapperIgnoreSource(nameof(DomainBlogPost.Author))]
    [MapperIgnoreTarget(nameof(BlogPost.Author))]
    [MapperIgnoreSource(nameof(DomainBlogPost.AuthorId))]
    [MapperIgnoreTarget(nameof(BlogPost.AuthorId))]
    [MapperIgnoreTarget(nameof(BlogPost.Comments))]
    [MapperIgnoreSource(nameof(DomainBlogPost.Comments))]
    public partial void Map(DomainBlogPost updatedBlogPost, BlogPost originalBlogPost);
}
