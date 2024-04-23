import axios from "axios";
import {getToken, signOut} from "./AuthService.ts";
import {IValidationProblemDetails} from "../models/IProblemDetails.ts";
import {UnknownErrorMessage} from "../utils/ErrorsUtils.ts";

const httpClient = axios.create({
    baseURL: 'https://localhost:7281',
    transformResponse: (data, _, status) => {
        if (status === 204)
            return null;

        if (status === 401 || status === 403) {
            signOut();

            // TODO: Rework auth flow
            return "Unauthorized! Please sign in.";
        }

        let result = JSON.parse(data);

        if (status === 400 || status === 404) {
            const validationError: IValidationProblemDetails = result;
            let errorMessage = UnknownErrorMessage;

            if (validationError) {
                const errorsDictionary = validationError?.errors;

                if (errorsDictionary !== undefined) {
                    let validationErrorMessage = "";

                    for (let key in errorsDictionary) {
                        validationErrorMessage += errorsDictionary[key].join("\n");
                        validationErrorMessage += "\n\n";
                    }

                    if (validationErrorMessage !== "")
                        errorMessage = validationErrorMessage;
                }
            }

            return errorMessage;
        }

        return result;
    }
});

httpClient.interceptors.request.use((config) => {
    const token = getToken();

    if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default httpClient;