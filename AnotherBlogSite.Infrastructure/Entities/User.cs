using Microsoft.AspNetCore.Identity;

namespace AnotherBlogSite.Infrastructure.Entities;

public sealed class User: IdentityUser<Guid>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public ICollection<BlogPost> BlogPosts { get; set; }
    public ICollection<Comment> Comments { get; set; }
}
