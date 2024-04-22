import Comment from "../models/Comment"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteComment, updateComment} from "../services/CommentsService.ts";
import {useState} from "react";

export default function CommentListComponent(props: { comment: Comment }) {
    const { comment } = props;
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentContent, seteEitingCommentContent] = useState(comment.content);


    // TODO: errors handling
    const deleteCommentMutation = useMutation({ mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.setQueryData(["Comments", comment.blogPostId],
                (comments: Comment[]) => comments.filter(oldPost => oldPost.id !== comment.id));
        }
    });

    const updateCommentMutation = useMutation({ mutationFn: updateComment,
        onSuccess: (data) => {
            queryClient.setQueryData(["Comments", comment.blogPostId],
                (comments: Comment[]) => [...comments.filter(oldPost => oldPost.id !== comment.id), data]);
            
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
                          onChange={(e) => seteEitingCommentContent(e.target.value)}/>
                    <button
                        onClick={() => updateCommentMutation.mutate({
                            commentId: comment.id,
                            content: editingCommentContent,
                        })}>Edit
                    </button>

                    <button
                        onClick={() => {
                            setIsEditing(false);
                            seteEitingCommentContent(comment.content);
                        }}>Cancel
                    </button>
                </div>)
        }

        {!isEditing && <button onClick={() => setIsEditing(true)}>Edit</button>}
        <button onClick={() => deleteCommentMutation.mutate(comment.id)}>Delete</button>
    </div>
}