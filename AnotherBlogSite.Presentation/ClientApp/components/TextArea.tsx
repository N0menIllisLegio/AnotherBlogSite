import {forwardRef, TextareaHTMLAttributes} from "react";
import Error from "./Error.tsx";

interface ITextArea extends TextareaHTMLAttributes<HTMLTextAreaElement>{
    label?: string;
    error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, ITextArea>((props, ref) => {
    return <>
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <textarea ref={ref} value={props.value} onChange={props.onChange} cols={props.cols} rows={props.rows}
                  name={props.name} placeholder={props.placeholder} />
        <Error error={props.error} />
    </>
});

export default TextArea;