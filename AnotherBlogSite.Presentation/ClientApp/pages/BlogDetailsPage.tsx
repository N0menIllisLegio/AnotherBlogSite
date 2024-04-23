import {useNavigate, useParams} from "react-router";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteBlogPost, getBlogPost} from "../services/BlogPostsService.ts";
import {CreateComment, createComment, getBlogPostComments} from "../services/CommentsService.ts";
import CommentListComponent from "../components/CommentListComponent.tsx";
import {useState} from "react";
import {Link} from "react-router-dom";
import IBlogPost from "../models/IBlogPost.ts";
import Guid from "../models/Guid.ts";
import {AxiosError} from "axios";
import IComment from "../models/IComment.ts";
import QueryKey from "../utils/QueryKeys.ts";

export default function BlogDetailsPage() {
    const { blogPostId } = useParams();
    const [newCommentContent, setNewCommentContent] = useState("");
    const navigate = useNavigate();

    const blogPost = useQuery({
        queryKey: [QueryKey.BlogPosts, blogPostId],
        queryFn: () => getBlogPost(blogPostId!)
    });

    const deleteBlogMutation = useMutation<void, AxiosError<string>, Guid>({ mutationFn: deleteBlogPost,
        onSuccess: () => {
            queryClient.setQueryData([QueryKey.BlogPosts],
                (oldPosts: IBlogPost[]) => oldPosts.filter(oldPost => oldPost.id !== blogPostId));

            navigate("/blogPosts");
        }
    });

    const comments = useQuery({
        queryKey: [QueryKey.Comments, blogPostId],
        queryFn: () => getBlogPostComments(blogPostId!),
        enabled: !!blogPost.data?.id
    });

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation<IComment, AxiosError<string>, CreateComment>({
        mutationFn: createComment, onSuccess: (data) => {
            setNewCommentContent("");
            queryClient.setQueryData([QueryKey.Comments, blogPostId],
                (oldComments: IComment[]) => [...oldComments, data]);
        }
    });

    if (blogPost.isPending) return <div>Loading...</div>

    if (blogPost.isError) return <div>Error: {blogPost.error.message}</div>

    return <div>
        <button onClick={() => deleteBlogMutation.mutate(blogPostId!)}>Delete Blog</button>
        { deleteBlogMutation.isError && <div>Failed to delete a blog: {deleteBlogMutation.error.response?.data ?? deleteBlogMutation.error.message}</div> }

        <h4>{blogPost.data?.author.firstName}</h4>
        <h1>{blogPost.data?.title}</h1>
        <p>{blogPost.data?.content}</p>

        <Link to="edit">Edit Blog Post</Link>

        <div>
            <div>
                <textarea name="Text1" cols={100} rows={8} value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} />
                <button onClick={() => createCommentMutation.mutate({ blogPostId: blogPost.data.id, content: newCommentContent })}>Send</button>
                { createCommentMutation.isError && <div>Failed to create comment: {createCommentMutation.error.response?.data ?? createCommentMutation.error.message}</div> }
            </div>

            { comments.isPending && <p>Comments are loading...</p> }
            { comments.isError && <p>Failed to load comments: {comments.error.message}</p> }
            { comments.isSuccess && comments.data?.length == 0 && <div>No comments...</div>}
            { comments.data?.sort((comment1, comment2) => comment2.createdDate.getTime() - comment1.createdDate.getTime()).map(comment => <CommentListComponent key={comment.id} comment={comment} />) }
        </div>
    </div>
}