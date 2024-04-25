import useAxiosRequestProvider from "./useAxiosRequestProvider.ts";
import {useContext} from "react";
import {AuthContext, IAuthContext} from "../components/AuthContext.tsx";

interface ISignIn {
    accessToken: string;
}

export interface ISignInCredentials {
    email: string;
    password: string;
}

const useSignIn = (): (credentials: ISignInCredentials) => Promise<void> => {
    const requestProvider = useAxiosRequestProvider();
    const { updateAccessToken } = useContext(AuthContext) as IAuthContext;

    const signIn = async (creds: ISignInCredentials) => {
        const data = await requestProvider.post<ISignInCredentials, ISignIn>("Auth/SignIn", creds);

        updateAccessToken(data.accessToken);
    };

    return signIn;
}

export default useSignIn;