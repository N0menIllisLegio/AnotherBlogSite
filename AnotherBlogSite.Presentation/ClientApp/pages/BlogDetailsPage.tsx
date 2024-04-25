import {useNavigate, useParams} from "react-router";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CreateComment} from "../services/CommentsService.ts";
import CommentListComponent from "../components/CommentListComponent.tsx";
import {useContext} from "react";
import IBlogPost from "../models/IBlogPost.ts";
import Guid from "../models/Guid.ts";
import IComment from "../models/IComment.ts";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/BlogDetailsPage.css";
import {useBlogPostsService, useCommentsService} from "../hooks/useDependencyInjection.ts";
import RequestError from "../models/RequestError.ts";
import {AuthContext, IAuthContext} from "../components/AuthContext.tsx";
import TextArea from "../components/TextArea.tsx";
import Error from "../components/Error.tsx";
import {SubmitHandler, useForm } from "react-hook-form";

interface ICommentForm {
    content: string;
}

export default function BlogDetailsPage() {
    const { blogPostId } = useParams();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ICommentForm>();

    const navigate = useNavigate();
    const blogPostsService = useBlogPostsService();
    const commentsService = useCommentsService();
    const { accessToken } = useContext(AuthContext) as IAuthContext;

    const blogPost = useQuery({
        queryKey: [QueryKey.BlogPosts, blogPostId],
        queryFn: () => blogPostsService.getBlogPost(blogPostId!)
    });

    const deleteBlogMutation = useMutation<void, RequestError, Guid>({ mutationFn: blogPostsService.deleteBlogPost,
        onSuccess: () => {
            queryClient.setQueryData([QueryKey.BlogPosts],
                (oldPosts: IBlogPost[] | undefined) => oldPosts?.filter(oldPost => oldPost.id !== blogPostId));

            navigate("/blogPosts");
        }
    });

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation<IComment, RequestError, CreateComment>({
        mutationFn: commentsService.createComment, onSuccess: (data) => {
            reset({ content: "" })
            queryClient.setQueryData([QueryKey.BlogPosts, blogPostId],
                (oldBlogPost: IBlogPost | undefined) => oldBlogPost
                    ? ({ ...oldBlogPost, comments: [...oldBlogPost.comments ?? [], data] })
                    : undefined);
        }
    });

    const onSendComment: SubmitHandler<ICommentForm> = async (data) => {
        if (blogPost.data?.id)
            createCommentMutation.mutate({
                blogPostId: blogPost.data.id,
                content: data.content
            });
    }

    if (blogPost.isPending) return <div>Loading...</div>

    if (blogPost.isError) return <Error error={blogPost.error.message} />;

    const comments = blogPost.data.comments;

    return <div className="blogDetailsContent">
        <h1 style={{marginTop: "0px"}}>{blogPost.data?.title}</h1>

        <div className="infoSection">
            <span><b>{blogPost.data?.author.firstName} {blogPost.data?.author.lastName}</b></span>
            <span>{blogPost.data?.author.email}</span>
            <span>{blogPost.data?.createdDate.toLocaleString()}</span>
        </div>

        {deleteBlogMutation.isError && <Error error={`Failed to delete a blog: ${deleteBlogMutation.error.message}`} />}

        <p>{blogPost.data?.content}</p>

        { accessToken &&
            <div className="infoSection">
                <div>
                    <button className="actionButton editButton" onClick={() => navigate("edit")}>Edit Blog Post</button>
                    <button className="actionButton deleteButton" onClick={() => deleteBlogMutation.mutate(blogPostId!)}>Delete
                        Blog
                    </button>
                </div>
            </div>
        }

        <div>
            { accessToken &&
                <form style={{ marginTop: "2rem", marginBottom: "2rem" }} onSubmit={handleSubmit(onSendComment)}>
                    <TextArea cols={100} rows={8} placeholder="Write your comment..." error={errors.content?.message}
                              {...register("content", { required: "Please enter comment's content" })}/>
                    <br/>
                    <button type="submit" className="actionButton">Send</button>
                    {createCommentMutation.isError
                        && <Error error={`Failed to create comment: ${createCommentMutation.error.message}`} />}
                </form>
            }

            {comments?.length == 0 && <div style={{marginTop: "1rem"}}><i>No comments...</i></div>}

            {comments?.sort((comment1, comment2) => comment2.createdDate.getTime() - comment1.createdDate.getTime()).map(comment =>
                <CommentListComponent key={comment.id} comment={comment}/>)}
        </div>
    </div>
}