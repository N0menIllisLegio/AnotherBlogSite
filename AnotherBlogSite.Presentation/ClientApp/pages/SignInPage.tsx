import {useNavigate} from "react-router";
import "../assets/SignIn.css"
import useSignIn, {ISignInCredentials} from "../hooks/useSignIn.ts";
import Input from "../components/Input.tsx";
import ErrorElement from "../components/Error.tsx";
import { useForm, SubmitHandler } from 'react-hook-form';

export default function SignInPage() {
    const navigate = useNavigate();
    const signIn = useSignIn();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ISignInCredentials>();

    const onClickSignIn: SubmitHandler<ISignInCredentials> = async (data) => {
        try {
            await signIn(data);
            navigate("/");
        } catch (err) {
            if (err instanceof Error) {
                setError("root", { message: err.message, type: "value" });
            } else {
                setError("root", { message: "Something went wrong. Try again later.", type: "value" });
            }
        }
    }

    return <form className="signInContent" onSubmit={handleSubmit(onClickSignIn)}>
        <div>
            <Input type="email" label="Email:" error={errors.email?.message?.toString()}
                {...register("email", {
                    required: {
                        value: true,
                        message: "Please enter email address",
                    },
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Entered value does not match email format",
                    },
                })} />
            <Input type="password" label="Password:" error={errors.password?.message?.toString()}
                {...register("password", {
                    required: "Please enter password",
                    minLength: {
                        value: 8,
                        message: "Min password length is 8",
                    },
                })} />
        </div>

        <div className="signInBelowInputs">
            { !isSubmitting && <button type="submit" className="actionButton">Sign In</button> }
            { isSubmitting && <div>Signing in...</div> }
            { errors.root?.message && <ErrorElement error={errors.root?.message} /> }
        </div>
    </form>
}