using AnotherBlogSite.Application.Common;

namespace AnotherBlogSite.Application.Models;

public sealed class Result<TModel>: EmptyResult
{
    public static Result<TModel> CreateSuccess(TModel value)
    {
        return new Result<TModel>
        {
            Value = value,
            Succeeded = true,
        };
    }

    public static Result<TModel> CreateFailure(string error, ErrorType errorType = Common.ErrorType.General)
    {
        return new Result<TModel>
        {
            Succeeded = false,
            ErrorType = errorType,
            Error = error,
        };
    }
    
    public TModel? Value { get; set; }
}
