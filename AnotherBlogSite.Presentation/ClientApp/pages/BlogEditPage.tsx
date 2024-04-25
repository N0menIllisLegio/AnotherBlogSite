﻿import {useNavigate, useParams} from "react-router";
import {FormEvent, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateBlogPost, UpdateBlogPost} from "../services/BlogPostsService.ts";
import IBlogPost from "../models/IBlogPost.ts";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/BlogEditPage.css";
import {useBlogPostsService} from "../hooks/useDependencyInjection.ts";
import RequestError from "../models/RequestError.ts";
import Input from "../components/Input.tsx";
import TextArea from "../components/TextArea.tsx";

export default function BlogEditPage() {
    const { blogPostId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const blogPostsService = useBlogPostsService();
    const blogPost = useQuery({
        queryKey: [QueryKey.BlogPosts, blogPostId],
        queryFn: () => blogPostsService.getBlogPost(blogPostId!),
        enabled: !!blogPostId,
    });

    const createMutation = useMutation<IBlogPost, RequestError, CreateBlogPost>({ mutationFn: blogPostsService.createBlogPost, onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId], data);
            queryClient.setQueryData([QueryKey.BlogPosts], (oldData: IBlogPost[] | undefined) => oldData
                ? [...oldData, data]
                : undefined);

            navigate(`/blogPosts/${data.id}`, { replace: true });
        }
    });

    const updateMutation = useMutation<IBlogPost, RequestError, UpdateBlogPost>({ mutationFn: blogPostsService.updateBlogPost, onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId], data);
            queryClient.setQueryData([QueryKey.BlogPosts],
                (oldData: IBlogPost[] | undefined) => oldData
                    ? [...oldData.filter(x => x.id !== blogPostId), data]
                    : undefined);

            navigate(-1);
        }
    });

    const handleEdit = (e: FormEvent) => {
        e.preventDefault();

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

    return <form onSubmit={handleEdit} className="blogEditContent">
        <Input value={blogTitle} onChange={e => setBlogTitle(e.target.value)} type="text" name="title" label="Blog Title:" />
        <small>Title should be at least 10 characters long. Current length: {blogTitle.length}</small>

        <br/>
        <TextArea value={blogContent} onChange={e => setBlogContent(e.target.value)}
                  cols={100} rows={30} name="content" label="Blog Content:" />
        <small>Content should be at least 500 characters long. Current length: {blogContent.length}</small>

        <div>
            <button className="actionButton" type="submit">{!!blogPostId ? "Edit" : "Add"} Post</button>
            {updateMutation.isError && <div className="errorContainer">{updateMutation.error.message}</div>}
            {createMutation.isError && <div className="errorContainer">{createMutation.error.message}</div>}
        </div>
    </form>
}