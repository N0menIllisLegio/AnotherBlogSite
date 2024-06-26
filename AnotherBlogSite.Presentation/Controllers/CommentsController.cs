﻿using System.Net;
using System.Security.Claims;
using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Services;
using AnotherBlogSite.Presentation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace AnotherBlogSite.Presentation.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public sealed class CommentsController: BaseController
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpPost]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType<CommentModel>((int)HttpStatusCode.OK)]
    [ProducesResponseType((int) HttpStatusCode.Forbidden)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> Create([FromBody] CommentCreateRequest request)
    {
        string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
            return Forbid();

        var result = await _commentService.CreateAsync(userId, request.BlogPostId, request.Content);

        return OperationResult(result);
    }

    [HttpPut]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType<CommentModel>((int)HttpStatusCode.OK)]
    [ProducesResponseType<ValidationProblemDetails>((int) HttpStatusCode.BadRequest)]
    public async Task<IActionResult> Update([FromBody] CommentUpdateRequest request)
    {
        var result = await _commentService.UpdateAsync(request.CommentId, request.Content);

        return OperationResult(result);
    }

    [HttpDelete("{commentId}")]
    [ProducesResponseType((int) HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    public async Task<IActionResult> Delete([FromRoute] Guid commentId)
    {
        await _commentService.DeleteAsync(commentId);

        return NoContent();
    }
}
