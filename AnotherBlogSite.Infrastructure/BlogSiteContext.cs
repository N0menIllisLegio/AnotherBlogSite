using AnotherBlogSite.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AnotherBlogSite.Infrastructure;

internal sealed class BlogSiteContext: IdentityUserContext<User, Guid>
{
    public BlogSiteContext(DbContextOptions<BlogSiteContext> options)
        : base(options)
    {
    }

    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder
            .Entity<BlogPost>()
            .HasOne(e => e.Author)
            .WithMany(e => e.BlogPosts)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<BlogPost>()
            .HasMany(e => e.Comments)
            .WithOne(e => e.BlogPost)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<Comment>()
            .HasOne(e => e.Author)
            .WithMany(e => e.Comments)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<BlogPost>()
            .Property(x => x.Title)
            .HasMaxLength(255);
    }
}
