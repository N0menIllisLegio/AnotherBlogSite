using AnotherBlogSite.Application.Common;

namespace AnotherBlogSite.Application.Models;

public class EmptyResult
{
    public static EmptyResult CreateSuccess()
    {
        return new EmptyResult
        {
            Succeeded = true,
        };
    }

    public static EmptyResult CreateFailure(string error, ErrorType errorType = Common.ErrorType.General)
    {
        return new EmptyResult
        {
            Succeeded = false,
            ErrorType = errorType,
            Error = error,
        };
    }
    
    public bool Succeeded { get; set; }
    public string? Error { get; set; }
    public ErrorType? ErrorType { get; set; }
}
