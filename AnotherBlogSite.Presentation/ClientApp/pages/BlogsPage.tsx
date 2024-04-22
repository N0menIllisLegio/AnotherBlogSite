import {useQuery} from "@tanstack/react-query";
import {getBlogPosts} from "../services/BlogPostsService.ts";
import BlogPostListComponent from "../components/BlogPostListComponent.tsx";
import "../assets/BlogsPage.css";
import {Link} from "react-router-dom";

export default function BlogsPage() {
    const { data, error, isPending, isError } = useQuery({ queryKey: ["BlogPosts"], queryFn: getBlogPosts });


    // TODO: Empty page
    
    if (isPending) return <div>Loading...</div>
    
    if (isError) return <div>Error: {error.message}</div>
    
    return <div className="blogsPages">
        { data?.sort((blogPost1, blogPost2) => blogPost2.createdDate.getTime() - blogPost1.createdDate.getTime()).map(blogPost => <BlogPostListComponent key={blogPost.id} blogPost={blogPost} />) }
        <Link className="addBlogPostButton" to="new">Add Blog Post</Link>
    </div>
}