import { HTMLInputTypeAttribute, ChangeEventHandler } from "react";

interface IInput {
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>;
    type: HTMLInputTypeAttribute;
    name?: string;
    label?: string;
}

export default function Input(props: IInput) {
    return <>
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <input type={props.type} name={props.name} value={props.value} onChange={props.onChange} />
    </>
}