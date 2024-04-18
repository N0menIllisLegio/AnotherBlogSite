using AnotherBlogSite.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AnotherBlogSite.Data;

public sealed class BlogSiteContext: IdentityUserContext<User, Guid>
{
    public BlogSiteContext(DbContextOptions<BlogSiteContext> options)
        : base(options)
    {
    }
    
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<Comment> Comments { get; set; }
}
