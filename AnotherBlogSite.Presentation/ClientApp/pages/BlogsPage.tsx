import {useQuery} from "@tanstack/react-query";
import {getBlogPosts} from "../services/BlogPostsService.ts";
import BlogPostListComponent from "../components/BlogPostListComponent.tsx";
import "../assets/BlogsPage.css";
import QueryKey from "../utils/QueryKeys.ts";
import {useNavigate} from "react-router";

export default function BlogsPage() {
    const navigate = useNavigate();
    const blogPosts = useQuery({ queryKey: [QueryKey.BlogPosts], queryFn: getBlogPosts });

    if (blogPosts.isPending) return <div>Loading...</div>
    if (blogPosts.isError) return <div>Error: {blogPosts.error.message}</div>

    return <div className="blogsPages">
        { blogPosts.isSuccess && blogPosts.data?.length == 0 && <div>No Blog posts</div> }
        { blogPosts.data?.sort((blogPost1, blogPost2) => blogPost2.createdDate.getTime() - blogPost1.createdDate.getTime()).map(blogPost => <BlogPostListComponent key={blogPost.id} blogPost={blogPost} />) }
        <button className="addBlogPostButton actionButton" onClick={() => navigate("new")}>Write a Post</button>
    </div>
}