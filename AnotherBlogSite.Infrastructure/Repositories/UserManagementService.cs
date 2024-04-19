using AnotherBlogSite.Domain.Repositories;
using Microsoft.AspNetCore.Identity;

using InfrastructureUser = AnotherBlogSite.Infrastructure.Entities.User;
using DomainUser = AnotherBlogSite.Domain.Entities.User;

namespace AnotherBlogSite.Infrastructure.Repositories;

internal sealed class UserManagementService: IUserManagementService
{
    private readonly UserManager<InfrastructureUser> _userManager;

    public UserManagementService(UserManager<InfrastructureUser> userManager)
    {
        _userManager = userManager;
    }
}
