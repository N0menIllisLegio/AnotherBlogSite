using Riok.Mapperly.Abstractions;
using InfrastructureUser = AnotherBlogSite.Infrastructure.Entities.User;
using DomainUser = AnotherBlogSite.Domain.Entities.User;

namespace AnotherBlogSite.Infrastructure.Mapper;

[Mapper]
internal sealed partial class UserMapper
{
    public partial InfrastructureUser MapToInfrastructure(DomainUser user);
}
