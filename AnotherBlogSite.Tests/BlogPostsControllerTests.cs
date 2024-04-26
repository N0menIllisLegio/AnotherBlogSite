using AnotherBlogSite.Application.Common;
using AnotherBlogSite.Application.Entities;
using AnotherBlogSite.Application.Services;
using AnotherBlogSite.Presentation.Controllers;
using AnotherBlogSite.Presentation.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace AnotherBlogSite.Tests;

public sealed class BlogPostsControllerTests
{
    [Fact]
    public async Task GetExistingBlogPost()
    {
        var blogId = Guid.NewGuid();

        var mockService = new Mock<IBlogPostService>();
        mockService.Setup(service => service.GetAsync(blogId)).ReturnsAsync(
            Result<BlogPostModel>.CreateSuccess(new BlogPostModel()
            {
                Id = blogId,
                CreatedDate = DateTimeOffset.UtcNow,
                Content = "Content",
                Title = "Title",
                AuthorId = Guid.NewGuid()
            }));

        var controller = new BlogPostsController(mockService.Object);

        var result = await controller.Get(blogId);

        var viewResult = Assert.IsType<OkObjectResult>(result);
        var model = Assert.IsAssignableFrom<BlogPostModel>(viewResult.Value);
        Assert.Equal(blogId, model.Id);
    }


    [Fact]
    public async Task GetNonExistingBlogPost()
    {
        var blogId = Guid.NewGuid();
        string originalErrorMessage = "Not found";

        var mockService = new Mock<IBlogPostService>();
        mockService.Setup(service => service.GetAsync(blogId)).ReturnsAsync(
            Result<BlogPostModel>.CreateFailure(originalErrorMessage, ErrorType.NotFound));

        var controller = new BlogPostsController(mockService.Object);

        var result = await controller.Get(blogId);

        var viewResult = Assert.IsType<NotFoundObjectResult>(result);
        var model = Assert.IsAssignableFrom<ValidationProblemDetails>(viewResult.Value);
        Assert.Single(model.Errors["GeneralError"], x => x.Equals(originalErrorMessage));
    }


    [Fact]
    public async Task DeleteBlogPost()
    {
        var blogId = Guid.NewGuid();

        var mockService = new Mock<IBlogPostService>();
        mockService.Setup(service => service.DeleteAsync(blogId)).Returns(() => Task.CompletedTask);

        var controller = new BlogPostsController(mockService.Object);

        var result = await controller.Delete(blogId);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdateBlogPost()
    {
        var blogId = Guid.NewGuid();
        string title = "new title";
        string content = "new content";

        var mockService = new Mock<IBlogPostService>();
        mockService.Setup(service => service.UpdateAsync(blogId, title, content))
            .ReturnsAsync(Result<BlogPostModel>.CreateSuccess(new ()
            {
                Id = blogId,
                Content = content,
                Title = title,
            }));

        var controller = new BlogPostsController(mockService.Object);

        var result = await controller.Update(new BlogPostUpdateRequest()
        {
            BlogPostId = blogId,
            Title = title,
            Content = content,
        });

        var viewResult = Assert.IsType<OkObjectResult>(result);
        var model = Assert.IsAssignableFrom<BlogPostModel>(viewResult.Value);
        Assert.Equal(blogId, model.Id);
        Assert.Equal(title, model.Title);
        Assert.Equal(content, model.Content);
    }

    [Fact]
    public async Task UpdateBlogPostFailure()
    {
        var blogId = Guid.NewGuid();
        string title = "wrong title";
        string content = "wrong content";
        string error = "Failed to update Blog Post";

        var mockService = new Mock<IBlogPostService>();
        mockService.Setup(service => service.UpdateAsync(blogId, title, content))
            .ReturnsAsync(Result<BlogPostModel>.CreateFailure(error));

        var controller = new BlogPostsController(mockService.Object);

        var result = await controller.Update(new BlogPostUpdateRequest()
        {
            BlogPostId = blogId,
            Title = title,
            Content = content,
        });

        var viewResult = Assert.IsType<BadRequestObjectResult>(result);
        var model = Assert.IsAssignableFrom<ValidationProblemDetails>(viewResult.Value);
        Assert.Single(model.Errors["GeneralError"], x => x.Equals(error));
    }
}
