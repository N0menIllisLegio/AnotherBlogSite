export default class RequestError extends Error {
    constructor(message?: string | undefined | null) {
        if (message)
            super(message);
        else
            super("Oops unexpected error happened... Please try again later");
    }
}