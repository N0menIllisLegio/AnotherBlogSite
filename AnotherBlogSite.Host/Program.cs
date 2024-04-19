using AnotherBlogSite.Application;
using AnotherBlogSite.Infrastructure;
using AnotherBlogSite.Presentation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddPresentation();

var app = builder.Build();

await app.Services.ApplyMigrationsAsync();

app.UsePresentation();

app.Run();