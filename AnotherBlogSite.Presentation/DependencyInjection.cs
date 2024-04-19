using AnotherBlogSite.Presentation.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace AnotherBlogSite.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                Description = "JWT bearer authorization.",
                Scheme = "Bearer",
                BearerFormat = "JWT",
                Type = SecuritySchemeType.ApiKey,
                In = ParameterLocation.Header,
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new() { Reference = new() { Id = "Bearer", Type = ReferenceType.SecurityScheme } },
                    new string[] { }
                }
            });
        });
        
        services.AddTransient<RequestsLoggingMiddleware>();
        services.AddControllers();
        
        return services;
    }

    public static void UsePresentation(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwaggerUI();
            app.UseSwagger();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();

        app.UseMiddleware<RequestsLoggingMiddleware>();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");
        
        app.MapFallbackToFile("index.html");
    }
}
