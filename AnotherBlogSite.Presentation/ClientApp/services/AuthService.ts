import httpClient from "./RequestProvider.ts";

const TokenKey: string = "AnotherBlogSite-Token";

interface ISignIn {
    accessToken: string;
}

export const signIn = async (email: string, password: string): Promise<void> => {
    const response = await httpClient.post<ISignIn>("Auth/SignIn", {
        email,
        password,
    });
    
    localStorage.setItem(TokenKey, response.data.accessToken);
}

export const getToken = (): string | null => localStorage.getItem(TokenKey);

export const signOut = (): void => localStorage.removeItem(TokenKey);

export const isSignedIn = (): boolean => {
    const token = localStorage.getItem(TokenKey);
    
    return token !== null && token.length > 0;
};