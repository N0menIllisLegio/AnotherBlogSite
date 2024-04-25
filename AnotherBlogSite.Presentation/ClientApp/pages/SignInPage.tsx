import {FormEvent, useState} from "react";
import {useNavigate} from "react-router";
import "../assets/SignIn.css"
import useSignIn from "../hooks/useSignIn.ts";
import Input from "../components/Input.tsx";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInExecuting, setSignInExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const signIn = useSignIn();

    const onClickSignIn = async (e: FormEvent) => {
        e.preventDefault();

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

    return <form className="signInContent" onSubmit={onClickSignIn}>
        <div>
            <Input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" label="Email:" />
            <Input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" label="Password:" />
        </div>

        <div className="signInBelowInputs">
            { !signInExecuting && <button type="submit" className="actionButton">Sign In</button> }
            { signInExecuting && <div>Signing in...</div> }
            { error && <div className="errorContainer">{error}</div> }
        </div>
    </form>
}