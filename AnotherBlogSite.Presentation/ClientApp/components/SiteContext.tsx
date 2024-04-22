import * as React from 'react';
import {createContext, useState} from "react";
import {isSignedIn} from "../services/AuthService.ts";

export interface ISiteContext {
    isUserAuthorized: boolean;
    setIsUserAuthorized: (authorized: boolean) => void;
}

export const SiteContext = createContext<ISiteContext | null>(null);

const SiteContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isUserAuthorized, setIsUserAuthorized] = useState<boolean>(isSignedIn());
    
    const updateUserAuthorized = (authorized: boolean) : void => setIsUserAuthorized(authorized);
    
    return <SiteContext.Provider value={{ isUserAuthorized, setIsUserAuthorized: updateUserAuthorized }}>
        {children}
    </SiteContext.Provider>;
};

export default SiteContextProvider;