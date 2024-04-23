import IBlogPost from "../models/IBlogPost.ts";
import {useNavigate} from "react-router";
import "../assets/BlogPostListComponent.css"

export default function BlogPostListComponent(props: { blogPost: IBlogPost }) {
    const navigate = useNavigate();

    return <div className="blogPostListItem" onClick={() => navigate(`${props.blogPost.id}`)}>
        <h3>{props.blogPost.title}</h3>
        <p>{props.blogPost.content.slice(0, 350).trimEnd()}...</p>
        <p style={ { color: "var(--primary-color)" } }><u><i>Read all &gt;</i></u></p>
    </div>
}