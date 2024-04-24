import {AxiosError, AxiosInstance} from "axios";
import IRequestProvider from "../models/IRequestProvider.ts";
import RequestError from "../models/RequestError.ts";

export default class AxiosRequestProvider implements IRequestProvider {
    #axiosProvider: AxiosInstance;

    constructor(axiosProvider: AxiosInstance) {
        this.#axiosProvider = axiosProvider;
    }

    async get<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
        try {
            const response = await this.#axiosProvider.get<TResponse>(path, { signal });

            return response.data;
        } catch (err) {
            this.#handleException(err);
        }
    }

    async post<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse> {
        try {
            const response = await this.#axiosProvider.post<TResponse>(path, request, { signal });

            return response.data;
        } catch (err) {
            this.#handleException(err);
        }
    }

    async put<TRequest, TResponse>(path: string, request: TRequest, signal?: AbortSignal): Promise<TResponse> {
        try {
            const response = await this.#axiosProvider.put<TResponse>(path, request, { signal });

            return response.data;
        } catch (err) {
            this.#handleException(err);
        }
    }

    async delete<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
        try {
            const response = await this.#axiosProvider.delete<TResponse>(path, { signal });

            return response.data;
        } catch (err) {
            this.#handleException(err);
        }
    }

    #handleException(err: unknown): never {
        let errorMessage: string | null = null;

        if (err instanceof AxiosError) {
            errorMessage = err.response?.data;
        } else {
            console.error(err);
        }

        console.log("Throwing error");

        throw new RequestError(errorMessage);
    }
}