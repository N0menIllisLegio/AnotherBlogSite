export interface ProblemDetails {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
}

export type ErrorsDictionary = {
    [key: string]: string[];
};

export interface ValidationProblemDetails extends ProblemDetails {
    errors?: ErrorsDictionary;
}