import {useNavigate, useParams} from "react-router";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateComment} from "../services/CommentsService.ts";
import CommentListComponent from "../components/CommentListComponent.tsx";
import {useState} from "react";
import IBlogPost from "../models/IBlogPost.ts";
import Guid from "../models/Guid.ts";
import IComment from "../models/IComment.ts";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/BlogDetailsPage.css";
import {useBlogPostsService, useCommentsService} from "../hooks/useDependencyInjection.ts";
import RequestError from "../models/RequestError.ts";

export default function BlogDetailsPage() {
    const { blogPostId } = useParams();
    const [newCommentContent, setNewCommentContent] = useState("");
    const navigate = useNavigate();
    const blogPostsService = useBlogPostsService();
    const commentsService = useCommentsService();

    const blogPost = useQuery({
        queryKey: [QueryKey.BlogPosts, blogPostId],
        queryFn: () => blogPostsService.getBlogPost(blogPostId!)
    });

    const deleteBlogMutation = useMutation<void, RequestError, Guid>({ mutationFn: blogPostsService.deleteBlogPost,
        onSuccess: () => {
            queryClient.setQueryData([QueryKey.BlogPosts],
                (oldPosts: IBlogPost[]) => oldPosts.filter(oldPost => oldPost.id !== blogPostId));

            navigate("/blogPosts");
        }
    });

    const comments = useQuery({
        queryKey: [QueryKey.Comments, blogPostId],
        queryFn: () => commentsService.getBlogPostComments(blogPostId!),
        enabled: !!blogPost.data?.id
    });

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation<IComment, RequestError, CreateComment>({
        mutationFn: commentsService.createComment, onSuccess: (data) => {
            setNewCommentContent("");
            queryClient.setQueryData([QueryKey.Comments, blogPostId],
                (oldComments: IComment[]) => [...oldComments, data]);
        }
    });

    if (blogPost.isPending) return <div>Loading...</div>

    if (blogPost.isError) return <div className="errorContainer">Error: {blogPost.error.message}</div>

    return <div className="blogDetailsContent">
        <h1 style={{marginTop: "0px"}}>{blogPost.data?.title}</h1>

        <div className="infoSection">
            <span><b>{blogPost.data?.author.firstName} {blogPost.data?.author.lastName}</b></span>
            <span>{blogPost.data?.author.email}</span>
            <span>{blogPost.data?.createdDate.toLocaleString()}</span>
        </div>

        {deleteBlogMutation.isError && <div className="errorContainer">Failed to delete a
            blog: {deleteBlogMutation.error.message}</div>}

        <p>{blogPost.data?.content}</p>

        <div className="infoSection">
            <div>
                <button className="actionButton editButton" onClick={() => navigate("edit")}>Edit Blog Post</button>
                <button className="actionButton deleteButton" onClick={() => deleteBlogMutation.mutate(blogPostId!)}>Delete
                    Blog
                </button>
            </div>
        </div>

        <div>
            <form style={{marginTop: "2rem", marginBottom: "2rem"}} onSubmit={(e) => {
                e.preventDefault();

                createCommentMutation.mutate({
                    blogPostId: blogPost.data.id,
                    content: newCommentContent
                });
            }}>
                <textarea placeholder="Write your comment..." rows={8} value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}/>
                <br/>
                <button type="submit" className="actionButton">Send
                </button>
                {createCommentMutation.isError && <div className="errorContainer">Failed to create
                    comment: {createCommentMutation.error.message}</div>}
            </form>

            {comments.isPending && <div>Comments are loading...</div>}
            {comments.isError &&
                <div className="errorContainer">Failed to load comments: {comments.error.message}</div>}
            {comments.isSuccess && comments.data?.length == 0 &&
                <div style={{marginTop: "1rem"}}><i>No comments...</i></div>}

            {comments.data?.sort((comment1, comment2) => comment2.createdDate.getTime() - comment1.createdDate.getTime()).map(comment =>
                <CommentListComponent key={comment.id} comment={comment}/>)}
        </div>
    </div>
}