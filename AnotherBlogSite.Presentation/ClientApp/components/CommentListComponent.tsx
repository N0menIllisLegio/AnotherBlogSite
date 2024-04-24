import IComment from "../models/IComment.ts"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateComment} from "../services/CommentsService.ts";
import {useState} from "react";
import {AxiosError} from "axios";
import Guid from "../models/Guid.ts";
import QueryKey from "../utils/QueryKeys.ts";
import "../assets/CommentListComponent.css";
import {useCommentsService} from "../hooks/useDependencyInjection.ts";

export default function CommentListComponent(props: { comment: IComment }) {
    const { comment } = props;
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentContent, setEditingCommentContent] = useState(comment.content);
    const commentsService = useCommentsService();

    const deleteCommentMutation = useMutation<void, AxiosError<string>, Guid>({ mutationFn: commentsService.deleteComment,
        onSuccess: () => {
            queryClient.setQueryData([QueryKey.Comments, comment.blogPostId],
                (comments: IComment[]) => comments.filter(oldPost => oldPost.id !== comment.id));
        }
    });

    const updateCommentMutation = useMutation<IComment, AxiosError<string>, UpdateComment>({
        mutationFn: commentsService.updateComment,
        onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.Comments, comment.blogPostId],
                (comments: IComment[]) => [...comments.filter(oldPost => oldPost.id !== comment.id), data]);

            setIsEditing(false);
        }
    });

    return <div className="commentListItemContent">
        <div><b>{comment.author.firstName} {comment.author.lastName}</b> (<i>{comment.author.email}</i>)</div>
        <small>{comment.createdDate.toLocaleString()}</small>
        { !isEditing && <p className="comment">{comment.content}</p> }
        {
            isEditing && (
                <div>
                <textarea name="Text1" cols={100} rows={8} value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)} />
                    <br/>
                    <button
                        style={{ marginRight: "8px" }}
                        className="actionButton"
                        onClick={() => updateCommentMutation.mutate({
                            commentId: comment.id,
                            content: editingCommentContent,
                        })}>Edit
                    </button>

                    <button
                        className="actionButton deleteButton"
                        onClick={() => {
                            setIsEditing(false);
                            setEditingCommentContent(comment.content);
                        }}>Cancel
                    </button>
                </div>
            )
        }

        { !isEditing && <button style={{ marginRight: "8px" }}
            className="actionButton" onClick={() => setIsEditing(true)}>Edit</button> }
        { isEditing && updateCommentMutation.isError && <div className="errorContainer">{ updateCommentMutation.error.response?.data ?? updateCommentMutation.error.message }</div> }
        { !isEditing && <button
            className="actionButton deleteButton" onClick={() => deleteCommentMutation.mutate(comment.id)}>Delete</button> }
        { !isEditing && deleteCommentMutation.isError && <div className="errorContainer">{ deleteCommentMutation.error.response?.data ?? deleteCommentMutation.error.message }</div> }
    </div>
}