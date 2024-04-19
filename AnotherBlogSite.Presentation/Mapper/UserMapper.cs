using AnotherBlogSite.Domain.Entities;
using AnotherBlogSite.Presentation.Models;
using Riok.Mapperly.Abstractions;

namespace AnotherBlogSite.Presentation.Mapper;

[Mapper]
internal sealed partial class UserMapper
{
    public partial User MapToUser(SignUpRequest request);
}
