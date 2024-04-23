import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    CreateBlogPost,
    createBlogPost,
    getBlogPost,
    UpdateBlogPost,
    updateBlogPost
} from "../services/BlogPostsService.ts";
import IBlogPost from "../models/IBlogPost.ts";
import {AxiosError} from "axios";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/BlogEditPage.css";

export default function BlogEditPage() {
    const { blogPostId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const blogPost = useQuery({
        queryKey: [QueryKey.BlogPosts, blogPostId],
        queryFn: () => getBlogPost(blogPostId!),
        enabled: !!blogPostId,
    });

    const createMutation = useMutation<IBlogPost, AxiosError<string>, CreateBlogPost>({ mutationFn: createBlogPost, onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId], data);
            queryClient.setQueryData([QueryKey.BlogPosts], (oldData: IBlogPost[]) => [...oldData, data]);

            navigate(`/blogPosts/${data.id}`, { replace: true });
        }
    });

    const updateMutation = useMutation<IBlogPost, AxiosError<string>, UpdateBlogPost>({ mutationFn: updateBlogPost, onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId], data);
            queryClient.setQueryData([QueryKey.BlogPosts],
                (oldData: IBlogPost[]) => [...oldData.filter(x => x.id !== blogPostId), data]);

            navigate(-1);
        }
    });

    const handleEdit = () => {
        if (!!blogPostId) {
            updateMutation.mutate({ blogPostId, title: blogTitle, content: blogContent });
        } else {
            createMutation.mutate({ title: blogTitle, content: blogContent });
        }
    }

    useEffect(() => {
        if (!blogPost.isPending && !blogPost.isError) {
            setBlogTitle(blogPost.data.title);
            setBlogContent(blogPost.data.content);
        }
    }, [blogPost.data?.id]);

    return <div className="blogEditContent">
        <label htmlFor="title">Blog Title:</label>
        <input name="title" type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}/>
        <small>Title should be at least 10 characters long. Current length: {blogTitle.length}</small>
        <br/>
        <label htmlFor="content">Blog Content:</label>
        <textarea name="content" cols={100} rows={30} value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}/>
        <small>Content should be at least 500 characters long. Current length: {blogContent.length}</small>

        <div>
            <button className="actionButton" onClick={handleEdit}>{!!blogPostId ? "Edit" : "Add"} Post</button>
            {updateMutation.isError &&
                <div className="errorContainer">{updateMutation.error.response?.data ?? updateMutation.error.message}</div>}
            {createMutation.isError &&
                <div className="errorContainer">{createMutation.error.response?.data ?? createMutation.error.message}</div>}
        </div>
    </div>
}