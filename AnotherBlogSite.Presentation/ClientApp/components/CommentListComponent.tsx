import IComment from "../models/IComment.ts"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteComment, UpdateComment, updateComment} from "../services/CommentsService.ts";
import {useState} from "react";
import {AxiosError} from "axios";
import Guid from "../models/Guid.ts";
import QueryKey from "../utils/QueryKeys.ts";

export default function CommentListComponent(props: { comment: IComment }) {
    const { comment } = props;
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentContent, setEditingCommentContent] = useState(comment.content);

    const deleteCommentMutation = useMutation<void, AxiosError<string>, Guid>({ mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.setQueryData([QueryKey.Comments, comment.blogPostId],
                (comments: IComment[]) => comments.filter(oldPost => oldPost.id !== comment.id));
        }
    });

    const updateCommentMutation = useMutation<IComment, AxiosError<string>, UpdateComment>({
        mutationFn: updateComment,
        onSuccess: (data) => {
            queryClient.setQueryData([QueryKey.Comments, comment.blogPostId],
                (comments: IComment[]) => [...comments.filter(oldPost => oldPost.id !== comment.id), data]);

            setIsEditing(false);
        }
    });

    return <div>
        <h4>{comment.author.firstName}</h4>
        <div>{comment.createdDate.toDateString()}</div>
        { !isEditing && <div>{comment.content}</div> }
        {
            isEditing && (
                <div>
                <textarea name="Text1" cols={100} rows={8} value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}/>
                    <button
                        onClick={() => updateCommentMutation.mutate({
                            commentId: comment.id,
                            content: editingCommentContent,
                        })}>Edit
                    </button>

                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingCommentContent(comment.content);
                        }}>Cancel
                    </button>
                </div>
            )
        }

        { !isEditing && <button onClick={() => setIsEditing(true)}>Edit</button> }
        { isEditing && updateCommentMutation.isError && <div>{ updateCommentMutation.error.response?.data ?? updateCommentMutation.error.message }</div> }
        <button onClick={() => deleteCommentMutation.mutate(comment.id)}>Delete</button>
        { deleteCommentMutation.isError && <div>{ deleteCommentMutation.error.response?.data ?? deleteCommentMutation.error.message }</div> }
    </div>
}