export default function Error(props: {error?: string}) {
    return <>{ props.error && <div className="errorContainer">{props.error}</div> }</>
}