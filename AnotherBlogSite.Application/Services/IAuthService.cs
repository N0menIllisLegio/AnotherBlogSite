using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Common;
using AnotherBlogSite.Presentation.Models;

namespace AnotherBlogSite.Application.Services;

public interface IAuthService
{
    Task<EmptyResult> SignUpAsync(UserModel newUserModel, string password);
    Task<Result<SignInModel>> SignInAsync(string email, string password);
}