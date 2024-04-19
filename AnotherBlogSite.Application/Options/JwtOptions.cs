namespace AnotherBlogSite.Application.Options;

public sealed class JwtOptions
{
    public const string Jwt = "Jwt";

    public string Audience { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}