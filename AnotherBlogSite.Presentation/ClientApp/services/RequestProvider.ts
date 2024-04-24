import {AxiosInstance} from "axios";

export interface IRequestProvider {
    get<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse>;
    post<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse>;
    put<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse>;
    delete<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse>;
}

export class AxiosRequestProvider implements IRequestProvider {
    #axiosProvider: AxiosInstance;

    constructor(axiosProvider: AxiosInstance) {
        this.#axiosProvider = axiosProvider;
    }

    async get<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
        const response = await this.#axiosProvider.get<TResponse>(path, { signal });

        return response.data;
    }

    async post<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse> {
        const response = await this.#axiosProvider.post<TResponse>(path, request, { signal });

        return response.data;
    }

    async put<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse> {
        const response = await this.#axiosProvider.put<TResponse>(path, request, { signal });

        return response.data;
    }

    async delete<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
        const response = await this.#axiosProvider.delete<TResponse>(path, { signal });

        return response.data;
    }
}