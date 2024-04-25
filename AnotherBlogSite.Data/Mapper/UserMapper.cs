using AnotherBlogSite.Data.Entities;
using Riok.Mapperly.Abstractions;
using InfrastructureUser = AnotherBlogSite.Data.Entities.User;
using DomainUser = AnotherBlogSite.Application.Entities.User;

namespace AnotherBlogSite.Data.Mapper;

[Mapper]
internal sealed partial class UserMapper
{
    public partial User MapToInfrastructure(DomainUser user);
}
