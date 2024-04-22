import {signIn} from "../services/AuthService.ts";
import {useContext, useState} from "react";
import {useNavigate} from "react-router";
import {AxiosError} from "axios";
import {UnknownErrorMessage} from "../utils/ErrorsUtils.ts";
import {ISiteContext, SiteContext} from "../components/SiteContext.tsx";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInExecuting, setSignInExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setIsUserAuthorized } = useContext(SiteContext) as ISiteContext;
    const navigate = useNavigate();
    
    const onClickSignIn = async () => {
        setError(null);
        setSignInExecuting(true);
        
        try {
            await signIn(email, password);            
            setIsUserAuthorized(true);
            navigate("/");
        } catch (err) {
            let errorMessage = UnknownErrorMessage;
            
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data ?? errorMessage;                
            } else {
                console.error(err);
            }
            
            setError(errorMessage);
        } finally {
            setSignInExecuting(false);
        }
    }
    
    return <div>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        { signInExecuting && <div>Signing in...</div> }
        { !signInExecuting && <button onClick={onClickSignIn}>Sign In</button> }
        { error && <div>{error}</div> }
    </div>
}