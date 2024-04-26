using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Services;
using AnotherBlogSite.Presentation.Controllers;
using AnotherBlogSite.Presentation.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace AnotherBlogSite.Tests;

public sealed class AuthControllerTests
{
    [Fact]
    public async Task ValidSignIn()
    {
        string email = "user@example";
        string password = "Password543}{";
        string accessToken = "AccessTokenPlaceholder";

        var mockService = new Mock<IAuthService>();
        mockService.Setup(service => service.SignInAsync(email, password)).ReturnsAsync(
            Result<SignInModel>.CreateSuccess(new()
            {
                AccessToken = accessToken
            }));

        var controller = new AuthController(mockService.Object);

        var result = await controller.SignIn(new SignInRequest()
        {
            Email = email,
            Password = password,
        });

        var viewResult = Assert.IsType<OkObjectResult>(result);
        var model = Assert.IsAssignableFrom<SignInModel>(viewResult.Value);
        Assert.Equal(model.AccessToken, accessToken);
    }

    [Fact]
    public async Task InvalidSignIn()
    {
        string email = "user@example";
        string password = "passwroDcx213@";
        string error = "Incorrect email or password!";

        var mockService = new Mock<IAuthService>();
        mockService.Setup(service => service.SignInAsync(email, password)).ReturnsAsync(
            Result<SignInModel>.CreateFailure(error));

        var controller = new AuthController(mockService.Object);

        var result = await controller.SignIn(new SignInRequest()
        {
            Email = email,
            Password = password,
        });

        var viewResult = Assert.IsType<BadRequestObjectResult>(result);
        var model = Assert.IsAssignableFrom<ValidationProblemDetails>(viewResult.Value);
        Assert.Single(model.Errors["GeneralError"], x => x.Equals(error));
    }
}
