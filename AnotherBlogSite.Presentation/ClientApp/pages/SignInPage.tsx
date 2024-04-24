import {useState} from "react";
import {useNavigate} from "react-router";
import "../assets/SignIn.css"
import useSignIn from "../hooks/useSignIn.ts";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInExecuting, setSignInExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const signIn = useSignIn();

    const onClickSignIn = async () => {
        setError(null);
        setSignInExecuting(true);

        try {
            await signIn(email, password);
            navigate("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError(String(err));
            }
        } finally {
            setSignInExecuting(false);
        }
    }

    return <div className="signInContent">
        <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="signInBelowInputs">
            { !signInExecuting && <button onClick={onClickSignIn} className="actionButton">Sign In</button> }
            { signInExecuting && <div>Signing in...</div> }
            { error && <div className="errorContainer">{error}</div> }
        </div>
    </div>
}