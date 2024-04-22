import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createBlogPost, getBlogPost, updateBlogPost} from "../services/BlogPostsService.ts";
import BlogPost from "../models/BlogPost.ts";

export default function BlogEditPage() {
    const { blogPostId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const blogPost = useQuery({
        queryKey: ["BlogPosts", blogPostId],
        queryFn: () => getBlogPost(blogPostId!),
        enabled: !!blogPostId,
    });

    // TODO: errors handling
    const createMutation = useMutation({ mutationFn: createBlogPost, onSuccess: (data) => {
            queryClient.setQueryData(["BlogPosts", blogPostId], data);
            queryClient.setQueryData(["BlogPosts"], (oldData: BlogPost[]) => [...oldData, data]);
            
            navigate(`/blogPosts/${data.id}`, { replace: true });    
        }
    });
    
    const updateMutation = useMutation({ mutationFn: updateBlogPost, onSuccess: (data) => {
            queryClient.setQueryData(["BlogPosts", blogPostId], data);
            queryClient.setQueryData(["BlogPosts"],
                (oldData: BlogPost[]) => [...oldData.filter(x => x.id !== blogPostId), data]);
            
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
            console.log("Data set");
        }
    }, [blogPost.data?.id]);
    
    return <div>
        <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
        <textarea cols={100} rows={8} value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
        <button onClick={handleEdit}>{ !!blogPostId ? "Edit" : "Add" } Post</button>
    </div>
}