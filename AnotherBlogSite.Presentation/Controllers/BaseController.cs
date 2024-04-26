using AnotherBlogSite.Application.Common;
using Microsoft.AspNetCore.Mvc;
using EmptyResult = AnotherBlogSite.Application.Common.EmptyResult;

namespace AnotherBlogSite.Presentation.Controllers;

public class BaseController: ControllerBase
{
    protected IActionResult OperationResult<TModel>(Result<TModel> result)
    {
        if (result.Succeeded)
            return Ok(result.Value);

        if (result.ErrorType == ErrorType.NotFound)
        {
            ModelState.AddModelError("GeneralError", result.Error ?? "Resource not found!");

            var notFoundErrors = new ValidationProblemDetails(ModelState);

            return NotFound(notFoundErrors);
        }

        ModelState.AddModelError("GeneralError", result.Error ?? "Invalid input!");

        var badRequestErrors = new ValidationProblemDetails(ModelState);

        return BadRequest(badRequestErrors);
    }

    protected IActionResult OperationResult(EmptyResult result)
    {
        if (result.Succeeded)
            return NoContent();

        if (result.ErrorType == ErrorType.NotFound)
        {
            ModelState.AddModelError("GeneralError", result.Error ?? "Resource not found!");

            var notFoundErrors = new ValidationProblemDetails(ModelState);

            return NotFound(notFoundErrors);
        }

        ModelState.AddModelError("GeneralError", result.Error ?? "Invalid input!");

        var badRequestErrors = new ValidationProblemDetails(ModelState);

        return BadRequest(badRequestErrors);
    }
}
