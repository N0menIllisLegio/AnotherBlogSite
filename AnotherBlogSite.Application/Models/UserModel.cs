﻿namespace AnotherBlogSite.Application.Entities;

public sealed class UserModel
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
