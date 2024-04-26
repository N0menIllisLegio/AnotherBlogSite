using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Options;
using AnotherBlogSite.Common;
using AnotherBlogSite.Data.Entities;
using AnotherBlogSite.Presentation.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using UserMapper = AnotherBlogSite.Application.Mapper.UserMapper;

namespace AnotherBlogSite.Application.Services;

internal sealed class AuthService: IAuthService
{
    private const string InvalidEmailOrPasswordError = "Invalid email or password!";

    private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new();
    private readonly UserMapper _mapper = new();

    private readonly UserManager<User> _userManager;
    private readonly JwtOptions _jwtOptions;

    public AuthService(UserManager<User> userManager, IOptions<JwtOptions> options)
    {
        _userManager = userManager;
        _jwtOptions = options.Value;
    }

    public async Task<EmptyResult> SignUpAsync(UserModel newUserModel, string password)
    {
        var user = _mapper.Map(newUserModel);

        user.UserName = user.Email;

        var result = await _userManager.CreateAsync(user, password);

        if (result.Succeeded)
            return EmptyResult.CreateSuccess();

        return EmptyResult.CreateFailure(
            string.Join(Environment.NewLine, result.Errors.Select(x => x.Description)));
    }

    public async Task<Result<SignInModel>> SignInAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
            return Result<SignInModel>.CreateFailure(InvalidEmailOrPasswordError);

        bool success = await _userManager.CheckPasswordAsync(user, password);

        if (!success)
            return Result<SignInModel>.CreateFailure(InvalidEmailOrPasswordError);

        string token = GenerateToken(user);

        return Result<SignInModel>.CreateSuccess(new() { AccessToken = token });
    }

    private string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        return _jwtSecurityTokenHandler.CreateEncodedJwt(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            new ClaimsIdentity(claims),
            notBefore: null,
            expires: DateTime.Now.AddHours(2),
            issuedAt: DateTime.Now,
            credentials);
    }
}
