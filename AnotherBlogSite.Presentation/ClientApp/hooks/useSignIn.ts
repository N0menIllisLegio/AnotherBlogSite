import useAxiosRequestProvider from "./useAxiosRequestProvider.ts";
import {useContext} from "react";
import {AuthContext, IAuthContext} from "../components/AuthContext.tsx";

interface ISignIn {
    accessToken: string;
}

const useSignIn = (): (email: string, password: string) => Promise<void> => {
    const requestProvider = useAxiosRequestProvider();
    const { updateAccessToken } = useContext(AuthContext) as IAuthContext;

    const signIn = async (email: string, password: string) => {
        const data = await requestProvider.post<{email: string, password: string}, ISignIn>("Auth/SignIn", {
            email,
            password,
        });

        updateAccessToken(data.accessToken);
    };

    return signIn;
}

export default useSignIn;