import {useQuery} from "@tanstack/react-query";
import BlogPostListComponent from "../components/BlogPostListComponent.tsx";
import "../assets/BlogsPage.css";
import QueryKey from "../utils/QueryKeys.ts";
import {useNavigate} from "react-router";
import {useBlogPostsService} from "../hooks/useDependencyInjection.ts";
import {useContext} from "react";
import {AuthContext, IAuthContext} from "../components/AuthContext.tsx";
import Error from "../components/Error.tsx";

export default function BlogsPage() {
    const navigate = useNavigate();
    const blogPostsService = useBlogPostsService();
    const blogPosts = useQuery({ queryKey: [QueryKey.BlogPosts], queryFn: blogPostsService.getBlogPosts });
    const { accessToken } = useContext(AuthContext) as IAuthContext;

    if (blogPosts.isPending) return <div>Loading...</div>
    if (blogPosts.isError) return <Error error={blogPosts.error.message} />

    return <div className="blogsPages">
        { blogPosts.isSuccess && blogPosts.data?.length == 0 && <div>No Blog posts</div> }
        { blogPosts.data?.sort((blogPost1, blogPost2) => blogPost2.createdDate.getTime() - blogPost1.createdDate.getTime()).map(blogPost => <BlogPostListComponent key={blogPost.id} blogPost={blogPost} />) }
        { accessToken && <button className="addBlogPostButton actionButton" onClick={() => navigate("new")}>Write a Post</button> }
    </div>
}