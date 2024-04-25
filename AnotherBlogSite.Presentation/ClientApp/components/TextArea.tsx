import {ChangeEventHandler} from "react";

interface ITextArea {
    value: string
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    cols: number;
    rows: number;
    name?: string;
    label?: string;
    placeholder?: string;
}

export default function TextArea(props: ITextArea) {
    return <>
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <textarea value={props.value} onChange={props.onChange} cols={props.cols} rows={props.rows}
                  name={props.name} placeholder={props.placeholder} />
    </>
}
