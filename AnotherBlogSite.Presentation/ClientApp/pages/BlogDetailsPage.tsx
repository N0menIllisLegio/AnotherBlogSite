import {useNavigate, useParams} from "react-router";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteBlogPost, getBlogPost} from "../services/BlogPostsService.ts";
import {createComment, getBlogPostComments} from "../services/CommentsService.ts";
import CommentListComponent from "../components/CommentListComponent.tsx";
import {useState} from "react";
import {Link} from "react-router-dom";
import BlogPost from "../models/BlogPost.ts";

export default function BlogDetailsPage() {
    const { blogPostId } = useParams();
    const [newCommentContent, setNewCommentContent] = useState("");
    const navigate = useNavigate();
    
    const blogPost = useQuery({
        queryKey: ["BlogPosts", blogPostId],
        queryFn: () => getBlogPost(blogPostId!)
    });

    // TODO: errors handling

    // TODO: no comments state

    const deleteBlogMutation = useMutation({ mutationFn: deleteBlogPost,
        onSuccess: () => {
            queryClient.setQueryData(["BlogPosts"],
                (oldPosts: BlogPost[]) => oldPosts.filter(oldPost => oldPost.id !== blogPostId));
            
            navigate("/blogPosts");
        }
    });

    const comments = useQuery({
        queryKey: ["Comments", blogPostId],
        queryFn: () => getBlogPostComments(blogPostId!),
        enabled: !!blogPost.data?.id
    });
    
    const queryClient = useQueryClient();
    
    const createMutation = useMutation({ mutationFn: createComment, onSuccess: (data) => {
            setNewCommentContent("");
            queryClient.setQueryData(["Comments", blogPostId],
                (oldComments: Comment[]) => [...oldComments, data]);
        }
    });

    if (blogPost.isPending) return <div>Loading...</div>

    if (blogPost.isError) return <div>Error: {blogPost.error.message}</div>
    
    return <div>
        <button onClick={() => deleteBlogMutation.mutate(blogPostId!)}>Delete Blog</button>
        
        <h4>{blogPost.data?.author.firstName}</h4>
        <h1>{blogPost.data?.title}</h1>
        <p>{blogPost.data?.content}</p>
        
        <Link to="edit">Edit Blog Post</Link>
        
        <div>
            <div>
                <textarea name="Text1" cols={100} rows={8} value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} />
                <button onClick={() => createMutation.mutate({ blogPostId: blogPost.data.id, content: newCommentContent })}>Send</button>
            </div>
            
            { comments.isPending && <p>Comments are loading...</p> }
            { comments.isError && <p>Failed to load comments: {comments.error.message}</p> }
            { comments.data?.sort((comment1, comment2) => comment2.createdDate.getTime() - comment1.createdDate.getTime()).map(comment => <CommentListComponent key={comment.id} comment={comment} />) }
        </div>
    </div>
}