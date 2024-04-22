using Riok.Mapperly.Abstractions;

using DomainBlogPost = AnotherBlogSite.Domain.Entities.BlogPost;
using InfrastructureBlogPost = AnotherBlogSite.Infrastructure.Entities.BlogPost;

namespace AnotherBlogSite.Infrastructure.Mapper;

[Mapper]
internal sealed partial class BlogPostMapper
{
    [MapProperty(nameof(InfrastructureBlogPost.Content), nameof(DomainBlogPost.Content), Use = nameof(TruncateContent))]
    [MapperIgnoreSource(nameof(InfrastructureBlogPost.Comments))]
    public partial DomainBlogPost MapToDomainTruncated(InfrastructureBlogPost blogPosts);
    
    [UserMapping(Default = false)]
    private string TruncateContent(string content) => content.Substring(0, 350);
    
    [MapProperty(nameof(InfrastructureBlogPost.Content), nameof(DomainBlogPost.Content), Use = nameof(TruncateContent))]
    public partial IQueryable<DomainBlogPost> ProjectToDomain(IQueryable<InfrastructureBlogPost> blogPosts);
    
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.Comments))]
    public partial DomainBlogPost MapToDomainWithoutComments(InfrastructureBlogPost blogPost);
    
    public partial DomainBlogPost MapToDomainWithComments(InfrastructureBlogPost blogPost);
    
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.Author))]
    [MapperIgnoreSource(nameof(DomainBlogPost.Author))]
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.Comments))]
    public partial InfrastructureBlogPost MapToInfrastructure(DomainBlogPost blogPost);
    
    [MapperIgnoreSource(nameof(DomainBlogPost.Id))]
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.Id))]
    [MapperIgnoreSource(nameof(DomainBlogPost.CreatedDate))]
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.CreatedDate))]
    [MapperIgnoreSource(nameof(DomainBlogPost.Author))]
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.Author))]
    [MapperIgnoreSource(nameof(DomainBlogPost.AuthorId))]
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.AuthorId))]
    [MapperIgnoreTarget(nameof(InfrastructureBlogPost.Comments))]
    public partial void Map(DomainBlogPost updatedBlogPost, InfrastructureBlogPost originalBlogPost);
}
