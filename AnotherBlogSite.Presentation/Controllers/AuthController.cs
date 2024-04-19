using AnotherBlogSite.Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace AnotherBlogSite.Presentation.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public sealed class AuthController: ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    public void SignIn()
    {
        
    }

    [HttpPost]
    public void Register()
    {
        
    }
}
