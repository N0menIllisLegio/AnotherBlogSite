using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Services;

public interface IAuthService
{
    Task<EmptyResult> SignUpAsync(User newUser, string password);
    Task<Result<string>> SignInAsync(string email, string password);
}