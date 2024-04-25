import axios from "axios";
import {useContext, useEffect} from "react";
import {IAuthContext, AuthContext} from "../components/AuthContext.tsx";
import {useNavigate} from "react-router";
import {IValidationProblemDetails} from "../models/IProblemDetails.ts";
import IRequestProvider from "../models/IRequestProvider.ts";
import AxiosRequestProvider from "../models/AxiosRequestProvider.ts";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    transformResponse: (data, _, status) => {
        if (status === 204)
            return null;

        if (status === 401 || status === 403)
            return "Unauthorized! Please sign in.";

        let result = JSON.parse(data);

        if (status === 400 || status === 404) {
            const validationError: IValidationProblemDetails = result;
            let errorMessage = null;

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

const useAxiosRequestProvider = (): IRequestProvider => {
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
                }

                return Promise.reject(error);
            }
        );

        return () => {
            httpClient.interceptors.request.eject(requestIntercept);
            httpClient.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken])

    return new AxiosRequestProvider(httpClient);
}

export default useAxiosRequestProvider;