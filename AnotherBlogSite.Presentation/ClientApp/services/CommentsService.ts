import httpClient from "./RequestProvider.ts";
import Comment from "../models/Comment.ts";
import Guid from "../models/Guid.ts";

export const getBlogPostComments = async (blogPostId: Guid): Promise<Comment[]> => {
    const response = await httpClient.get<Comment[]>(`/Comments/${blogPostId}`);
    
    response.data.forEach(comment => comment.createdDate = new Date(comment.createdDate));

    return response.data;
}

export interface CreateComment {
    blogPostId: Guid;
    content: string;
}

export const createComment = async (createComment: CreateComment): Promise<Comment> => {
    const response = await httpClient.post<Comment>('/Comments', createComment);

    response.data.createdDate = new Date(response.data.createdDate);

    return response.data;
}

export interface UpdateComment {
    commentId: Guid;
    content: string;
}

export const updateComment = async (updateComment: UpdateComment): Promise<Comment> => {
    const response = await httpClient.put<Comment>('/Comments', updateComment);

    response.data.createdDate = new Date(response.data.createdDate);
    
    return response.data;
}

export const deleteComment = async (commentId: Guid): Promise<void> => {
    await httpClient.delete<null>(`/Comments/${commentId}`);
}