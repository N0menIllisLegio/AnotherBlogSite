using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Data.Entities;
using Riok.Mapperly.Abstractions;

namespace AnotherBlogSite.Application.Mapper;

[Mapper]
internal sealed partial class UserMapper
{
    public partial User Map(UserModel userModel);
}
