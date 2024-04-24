import * as React from 'react';
import {createContext, useState} from "react";

const TokenKey: string = "AnotherBlogSite-Token";

export interface IAuthContext {
    accessToken: string | null;
    updateAccessToken: (accessToken: string | null) => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem(TokenKey));

    const updateAccessToken = (accessToken: string | null) : void => {
        if (accessToken === null) {
            localStorage.removeItem(TokenKey);
        } else {
            localStorage.setItem(TokenKey, accessToken);
        }

        setAccessToken(accessToken);
    };

    return <AuthContext.Provider value={{ accessToken, updateAccessToken }}>
        {children}
    </AuthContext.Provider>;
};

export default AuthContextProvider;