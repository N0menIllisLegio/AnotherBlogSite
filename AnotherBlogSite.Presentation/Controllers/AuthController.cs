using System.Net;
using AnotherBlogSite.Application.Services;
using AnotherBlogSite.Presentation.Mapper;
using AnotherBlogSite.Presentation.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnotherBlogSite.Presentation.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public sealed class AuthController: BaseController
{
    private readonly UserMapper _mapper = new();
    
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    [ProducesResponseType<string>((int)HttpStatusCode.OK)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
    {
        var result = await _authService.SignInAsync(request.Email, request.Password);

        return OperationResult(result);
    }

    [HttpPost]
    [ProducesResponseType((int) HttpStatusCode.NoContent)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
    {
        var newUser = _mapper.MapToUser(request);
        
        var result = await _authService.SignUpAsync(newUser, request.Password);
        
        return OperationResult(result);
    }
}
