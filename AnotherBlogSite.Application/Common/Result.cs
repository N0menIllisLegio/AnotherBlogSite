namespace AnotherBlogSite.Application.Common;

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

    public static Result<TModel> CreateFailure(string error, ErrorType errorType = Application.Common.ErrorType.General)
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
