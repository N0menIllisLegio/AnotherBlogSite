﻿using System.Net;
using System.Security.Claims;
using AnotherBlogSite.Application.Services;
using AnotherBlogSite.Domain.Entities;
using AnotherBlogSite.Presentation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnotherBlogSite.Presentation.Controllers;

[ApiController]
[Route("[controller]/[action]")]
[Authorize]
public sealed class BlogPostsController: BaseController
{
    private readonly IBlogPostService _blogPostsService;

    public BlogPostsController(IBlogPostService blogPostsService)
    {
        _blogPostsService = blogPostsService;
    }

    [HttpPost]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType<Guid>((int)HttpStatusCode.OK)]
    [ProducesResponseType((int) HttpStatusCode.Forbidden)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> Create([FromBody] BlogPostCreateRequest request)
    {
        string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
            return Forbid();

        var result = await _blogPostsService.CreateAsync(request.Title, request.Content, userId);

        return OperationResult(result);
    }

    [HttpPut]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> Update([FromBody] BlogPostUpdateRequest request)
    {
        var result = await _blogPostsService.UpdateAsync(request.Id, request.Title, request.Content);

        return OperationResult(result);
    }

    [HttpDelete]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    public async Task<IActionResult> Delete([FromBody] Guid blogPostId)
    {
        await _blogPostsService.DeleteAsync(blogPostId);

        return NoContent();
    }

    [HttpGet("{blogPostId}")]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType<BlogPost>((int)HttpStatusCode.OK)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> Get([FromRoute] Guid blogPostId)
    {
        var result = await _blogPostsService.GetAsync(blogPostId);

        return OperationResult(result);
    }

    [HttpGet]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType<List<BlogPost>>((int)HttpStatusCode.OK)]
    public async Task<IActionResult> Get()
    {
        var result = await _blogPostsService.GetAllAsync();

        return Ok(result);
    }
}