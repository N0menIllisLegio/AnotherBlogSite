using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Presentation.Models;

namespace AnotherBlogSite.Application.Services;

public interface IAuthService
{
    Task<EmptyResult> SignUpAsync(User newUser, string password);
    Task<Result<SignInModel>> SignInAsync(string email, string password);
}