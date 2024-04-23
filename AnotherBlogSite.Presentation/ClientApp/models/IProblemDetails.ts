export interface IProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
}

export type ErrorsDictionary = {
    [key: string]: string[];
};

export interface IValidationProblemDetails extends IProblemDetails {
    errors?: ErrorsDictionary;
}