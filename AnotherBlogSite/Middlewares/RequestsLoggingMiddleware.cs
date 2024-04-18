using System.Text;
using Microsoft.AspNetCore.Http.Extensions;

namespace AnotherBlogSite.Middlewares;

internal sealed class RequestsLoggingMiddleware: IMiddleware
{
    private const string LogDateFormat = "dd/MM/yy HH:mm:ss:fff";
    
    private readonly ILogger<RequestsLoggingMiddleware> _logger;

    public RequestsLoggingMiddleware(ILogger<RequestsLoggingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        string bodyContent = await ReadRequestBodyAsync(context.TraceIdentifier, context.Request);
        
        _logger.LogInformation(
            "[{Time}] [{TraceIdentifier}] {Method} {Url} {bodyContent}", DateTime.Now.ToString(LogDateFormat),
            context.TraceIdentifier, context.Request.Method, context.Request.GetDisplayUrl(), bodyContent);

        await next(context);

        _logger.LogInformation("[{Time}] [{TraceIdentifier}] {StatusCode}", DateTime.Now.ToString(LogDateFormat),
            context.TraceIdentifier, context.Response.StatusCode);
    }

    private async Task<string> ReadRequestBodyAsync(string traceId, HttpRequest request)
    {
        if (request.ContentLength is null or 0)
            return "[NO BODY]";
        
        string body = Environment.NewLine;

        try
        {
            request.EnableBuffering();

            using var reader = new StreamReader(request.Body, Encoding.UTF8, true, 1024, true);

            body += await reader.ReadToEndAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "[{TraceId}] Failed to read request body", traceId);

            body = "[ERROR READING REQUEST BODY]";
        }
        finally
        {
            request.Body.Position = 0;
        }

        return body;
    }
}
