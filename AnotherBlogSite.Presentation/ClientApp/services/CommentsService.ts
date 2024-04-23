import httpClient from "./RequestProvider.ts";
import IComment from "../models/IComment.ts";
import Guid from "../models/Guid.ts";

export const getBlogPostComments = async (blogPostId: Guid): Promise<IComment[]> => {
    const response = await httpClient.get<IComment[]>(`/Comments/${blogPostId}`);

    response.data.forEach(comment => comment.createdDate = new Date(comment.createdDate));

    return response.data;
}

export interface CreateComment {
    blogPostId: Guid;
    content: string;
}

export const createComment = async (createComment: CreateComment): Promise<IComment> => {
    const response = await httpClient.post<IComment>('/Comments', createComment);

    response.data.createdDate = new Date(response.data.createdDate);

    return response.data;
}

export interface UpdateComment {
    commentId: Guid;
    content: string;
}

export const updateComment = async (updateComment: UpdateComment): Promise<IComment> => {
    const response = await httpClient.put<IComment>('/Comments', updateComment);

    response.data.createdDate = new Date(response.data.createdDate);

    return response.data;
}

export const deleteComment = async (commentId: Guid): Promise<void> => {
    await httpClient.delete<null>(`/Comments/${commentId}`);
}