import BlogPost from "../models/BlogPost.ts";
import {useNavigate} from "react-router";

export default function BlogPostListComponent(props: { blogPost: BlogPost }) {
    const navigate = useNavigate();
    
    return <div className="blogPostListItem" onClick={() => navigate(`${props.blogPost.id}`)}>
        <h3>{props.blogPost.title}</h3>
        <p>{props.blogPost.content.slice(0, 350)}...</p>
    </div>
}