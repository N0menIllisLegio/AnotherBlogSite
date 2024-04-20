using AnotherBlogSite.Application.Models;
using AnotherBlogSite.Application.Repositories;
using AnotherBlogSite.Domain.Entities;

namespace AnotherBlogSite.Application.Services;

internal sealed class BlogPostsService: IBlogPostService
{
    private readonly IBlogPostsRepository _blogPostsRepository;

    public BlogPostsService(IBlogPostsRepository blogPostsRepository)
    {
        _blogPostsRepository = blogPostsRepository;
    }
    
    public Task<List<BlogPost>> GetAllAsync()
    {
        return _blogPostsRepository.GetAllAsync();
    }

    public Task<Result<BlogPost>> GetAsync(Guid blogPostId)
    {
        return _blogPostsRepository.GetAsync(blogPostId);
    }

    public Task<Result<Guid>> CreateAsync(string title, string content, Guid authorId)
    {
        var newBlogPost = new BlogPost()
        {
            Title = title,
            AuthorId = authorId,
            Content = content,
            CreatedDate = DateTimeOffset.Now,
        };

        return _blogPostsRepository.CreateAsync(newBlogPost);
    }

    public Task<EmptyResult> UpdateAsync(Guid blogPostId, string title, string content)
    {
        var updatedBlogPost = new BlogPost()
        {
            Id = blogPostId,
            Title = title,
            Content = content,
        };

        return _blogPostsRepository.UpdateAsync(updatedBlogPost);
    }

    public Task DeleteAsync(Guid blogPostId)
    {
        return _blogPostsRepository.DeleteAsync(blogPostId);
    }
}
