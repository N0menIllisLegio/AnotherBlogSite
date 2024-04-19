using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AnotherBlogSite.Domain.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AnotherBlogSite.Application.Services;

internal sealed class AuthService: IAuthService
{
    private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new ();
    
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private string GenerateToken()
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, "useremail"),
            new("userid", Guid.NewGuid().ToString())
        };

        return _jwtSecurityTokenHandler.CreateEncodedJwt(
            _configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], new ClaimsIdentity(claims),
            notBefore: null,
            expires: DateTime.Now.AddHours(2),
            issuedAt: DateTime.Now,
            credentials);
    }
}
