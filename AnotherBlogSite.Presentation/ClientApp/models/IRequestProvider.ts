export default interface IRequestProvider {
    get<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse>;
    post<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse>;
    put<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse>;
    delete<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse>;
}