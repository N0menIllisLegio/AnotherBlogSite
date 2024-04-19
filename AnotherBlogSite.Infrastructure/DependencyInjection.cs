using AnotherBlogSite.Application.Repositories;
using AnotherBlogSite.Application.Services;
using AnotherBlogSite.Infrastructure.Entities;
using AnotherBlogSite.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AnotherBlogSite.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BlogSiteContext>(
            options => options.UseSqlServer(configuration.GetConnectionString("BlogSiteContext")));

        services.AddIdentityCore<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
                opt.Password.RequiredLength = 8;
                opt.Password.RequireDigit = true;
                opt.Password.RequireLowercase = true;
                opt.Password.RequireUppercase = true;
            })
            .AddEntityFrameworkStores<BlogSiteContext>();

        services.AddScoped<IBlogPostsRepository, BlogPostsRepository>();
        services.AddScoped<ICommentsRepository, CommentsRepository>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }

    public static async Task ApplyMigrationsAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;

        var context = services.GetRequiredService<BlogSiteContext>();
        await context.Database.MigrateAsync();
    }
}
