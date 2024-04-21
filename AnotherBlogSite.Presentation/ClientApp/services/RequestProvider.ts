import axios from "axios";
import {getToken} from "./AuthService.ts";

const httpClient = axios.create({
    baseURL: 'https://localhost:7281',
});

httpClient.interceptors.request.use((config) => {
    const token = getToken();
    
    if (token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
})


export default httpClient;