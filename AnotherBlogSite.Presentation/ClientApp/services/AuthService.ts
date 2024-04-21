import httpClient from "./RequestProvider.ts";

const TokenKey: string = "AnotherBlogSite-Token";

export const signIn = async (email: string, password: string): Promise<void> => {
    const response = await httpClient.post<string>("Auth/SignIn", {
        email,
        password,
    });
    
    localStorage.setItem(TokenKey, response.data);
}

export const getToken = (): string | null => localStorage.getItem(TokenKey);

export const signOut = (): void => localStorage.removeItem(TokenKey);