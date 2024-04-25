import {forwardRef, InputHTMLAttributes} from "react";
import Error from "./Error.tsx";

interface IInput extends InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
    return <>
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <input ref={ref} {...props} />
        <Error error={props.error} />
    </>
});

export default Input;