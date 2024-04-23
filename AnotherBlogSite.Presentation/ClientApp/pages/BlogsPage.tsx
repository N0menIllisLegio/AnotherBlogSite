import {useQuery} from "@tanstack/react-query";
import {getBlogPosts} from "../services/BlogPostsService.ts";
import BlogPostListComponent from "../components/BlogPostListComponent.tsx";
import "../assets/BlogsPage.css";
import {Link} from "react-router-dom";
import QueryKey from "../utils/QueryKeys.ts";

export default function BlogsPage() {
    const blogPosts = useQuery({ queryKey: [QueryKey.BlogPosts], queryFn: getBlogPosts });

    if (blogPosts.isPending) return <div>Loading...</div>

    if (blogPosts.isError) return <div>Error: {blogPosts.error.message}</div>

    return <div className="blogsPages">
        { blogPosts.isSuccess && blogPosts.data?.length == 0 && <div>No Blog posts</div> }
        { blogPosts.data?.sort((blogPost1, blogPost2) => blogPost2.createdDate.getTime() - blogPost1.createdDate.getTime()).map(blogPost => <BlogPostListComponent key={blogPost.id} blogPost={blogPost} />) }
        <Link className="addBlogPostButton" to="new">Add Blog Post</Link>
    </div>
}