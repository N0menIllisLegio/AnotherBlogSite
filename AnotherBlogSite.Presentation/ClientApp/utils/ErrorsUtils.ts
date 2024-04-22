import {ValidationProblemDetails} from "../models/ProblemDetails.ts";

export const UnknownErrorMessage = "Oops unexpected error happened... Please try again later";

export function ExtractValidationProblemDetailsMessage(error: ValidationProblemDetails): string | null {
    const errorsDictionary = error?.errors;
    
    if (errorsDictionary === undefined) return null;
    
    const message = errorsDictionary["GeneralError"][0];
    
    return message === undefined ? null : message;
}