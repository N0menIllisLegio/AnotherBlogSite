import IComment from "../models/IComment.ts"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateComment} from "../services/CommentsService.ts";
import {useContext, useState} from "react";
import Guid from "../models/Guid.ts";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/CommentListComponent.css";
import {useCommentsService} from "../hooks/useDependencyInjection.ts";
import RequestError from "../models/RequestError.ts";
import IBlogPost from "../models/IBlogPost.ts";
import {AuthContext, IAuthContext} from "./AuthContext.tsx";
import TextArea from "./TextArea.tsx";
import Error from "./Error.tsx";
import { useForm, SubmitHandler } from "react-hook-form";

interface ICommentForm {
    content: string;
}

export default function CommentListComponent(props: { comment: IComment }) {
    const { comment } = props;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ICommentForm>({ defaultValues: {
        content: comment.content
    }});

    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const commentsService = useCommentsService();
    const { accessToken } = useContext(AuthContext) as IAuthContext;

    const onEdit: SubmitHandler<ICommentForm> = async (data) => {
        updateCommentMutation.mutate({
            commentId: comment.id,
            content: data.content,
        });
    }

    const deleteCommentMutation = useMutation<void, RequestError, Guid>({ mutationFn: commentsService.deleteComment,
        onSuccess: () => {
            queryClient.setQueryData([QueryKey.BlogPosts, comment.blogPostId],
                (oldBlogPost: IBlogPost | undefined) => oldBlogPost
                    ? ({ ...oldBlogPost, comments: oldBlogPost.comments?.filter(x => x.id !== comment.id) })
                    : undefined);
        }
    });

    const updateCommentMutation = useMutation<IComment, RequestError, UpdateComment>({
        mutationFn: commentsService.updateComment,
        onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.BlogPosts, comment.blogPostId],
                (oldBlogPost: IBlogPost | undefined) => oldBlogPost
                    ? ({ ...oldBlogPost, comments: [...oldBlogPost.comments?.filter(oldPost => oldPost.id !== comment.id) ?? [], data] })
                    : undefined);

            setIsEditing(false);
        }
    });

    return <div className="commentListItemContent">
        <div><b>{comment.author.firstName} {comment.author.lastName}</b> (<i>{comment.author.email}</i>)</div>
        <small>{comment.createdDate.toLocaleString()}</small>
        { !isEditing && <p className="comment">{comment.content}</p> }
        {
            isEditing && (
                <form onSubmit={handleSubmit(onEdit)}>
                    <TextArea cols={100} rows={8} error={errors.content?.message}
                              {...register("content", { required: "Please enter comment's content" })} />
                    <br/>
                    <button
                        type="submit"
                        style={{ marginRight: "8px" }}
                        className="actionButton">Submit
                    </button>

                    <button
                        className="actionButton deleteButton"
                        onClick={() => {
                            setIsEditing(false);
                            reset({ content: comment.content });
                        }}>Cancel
                    </button>
                </form>
            )
        }

        { accessToken && !isEditing && <button style={{ marginRight: "8px" }}
            className="actionButton" onClick={() => setIsEditing(true)}>Edit</button> }
        { isEditing && updateCommentMutation.isError && <Error error={ updateCommentMutation.error.message } /> }
        {  accessToken && !isEditing && <button
            className="actionButton deleteButton" onClick={() => deleteCommentMutation.mutate(comment.id)}>Delete</button> }
        { !isEditing && deleteCommentMutation.isError && <Error error={ deleteCommentMutation.error.message } /> }
    </div>
}