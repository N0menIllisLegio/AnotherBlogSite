using AnotherBlogSite.Application;
using AnotherBlogSite.Data;
using AnotherBlogSite.Presentation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddPresentation();

builder.Services.AddCors(opt => opt.AddDefaultPolicy(
    x => x.WithOrigins("https://localhost:44435").AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

await app.Services.ApplyMigrationsAsync();

app.UseCors();

app.UsePresentation();

app.Run();