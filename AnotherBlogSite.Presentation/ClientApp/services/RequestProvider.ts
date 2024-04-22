import axios from "axios";
import {getToken, signOut} from "./AuthService.ts";
import {ValidationProblemDetails} from "../models/ProblemDetails.ts";
import {ExtractValidationProblemDetailsMessage, UnknownErrorMessage} from "../utils/ErrorsUtils.ts";

const httpClient = axios.create({
    baseURL: 'https://localhost:7281',
    transformResponse: (data, _, status) => {
        if (status === 204)
            return null;
        
        let result = JSON.parse(data);
        
        if (status === 400 || status === 404) {
            const validationError: ValidationProblemDetails = result;
            let errorMessage = UnknownErrorMessage;
            
            if (validationError) {
                errorMessage = ExtractValidationProblemDetailsMessage(validationError) ?? errorMessage;
            }
            
            return errorMessage;
        } else if (status === 401 || status === 403) {
            signOut();
            
            return "Unauthorized! Please sign in.";
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
})


export default httpClient;