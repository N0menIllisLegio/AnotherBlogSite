import axios from "axios";
import {useContext, useEffect} from "react";
// import useRefreshToken from "./useRefreshToken";
import {IAuthContext, AuthContext} from "../components/AuthContext.tsx";
import {useNavigate} from "react-router";
import {AxiosRequestProvider, IRequestProvider} from "../services/RequestProvider.ts";
import {IValidationProblemDetails} from "../models/IProblemDetails.ts";
import {UnknownErrorMessage} from "../utils/ErrorsUtils.ts";

const httpClient = axios.create({
    baseURL: 'https://localhost:7281',
    transformResponse: (data, _, status) => {
        if (status === 204)
            return null;

        if (status === 401 || status === 403) {
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

const useRequestProvider = (): IRequestProvider => {
    // const refresh = useRefreshToken();
    const { accessToken, updateAccessToken } = useContext(AuthContext) as IAuthContext;
    const navigate = useNavigate();

    useEffect(() => {
        const requestIntercept = httpClient.interceptors.request.use(
            config => {
                if (!config.headers['Authorization'] && accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }

                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = httpClient.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;

                if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?.sent) {
                    updateAccessToken(null);
                    prevRequest.sent = true;
                    navigate("/signIn");

                    // const newAccessToken = await refresh();
                    // prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // return httpClient(prevRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            httpClient.interceptors.request.eject(requestIntercept);
            httpClient.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken/*, refresh */])

    return new AxiosRequestProvider(httpClient);
}

export default useRequestProvider;