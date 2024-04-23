﻿import httpClient from "./RequestProvider.ts";
import IBlogPost from "../models/IBlogPost.ts";
import Guid from "../models/Guid.ts";

export const getBlogPosts = async (): Promise<IBlogPost[]> => {
    const response = await httpClient.get<IBlogPost[]>('/BlogPosts');

    response.data.forEach(x => x.createdDate = new Date(x.createdDate));

    return  response.data;
}

export const getBlogPost = async (blogPostId: Guid): Promise<IBlogPost> => {
    const response = await httpClient.get<IBlogPost>(`/BlogPosts/${blogPostId}`);

    response.data.createdDate = new Date(response.data.createdDate);

    return response.data;
}

export interface CreateBlogPost {
    title: string;
    content: string;
}

export const createBlogPost = async (createBlogPost: CreateBlogPost): Promise<IBlogPost> => {
    const response = await httpClient.post<IBlogPost>('/BlogPosts', createBlogPost);

    response.data.createdDate = new Date(response.data.createdDate);

    return response.data;
}

export interface UpdateBlogPost {
    blogPostId: Guid;
    title: string;
    content: string;
}

export const updateBlogPost = async (updateBlogPost: UpdateBlogPost): Promise<IBlogPost> => {
    const response = await httpClient.put<IBlogPost>('/BlogPosts', updateBlogPost);

    response.data.createdDate = new Date(response.data.createdDate);

    return response.data;
}

export const deleteBlogPost = async (blogPostId: Guid): Promise<void> => {
    await httpClient.delete<null>(`/BlogPosts/${blogPostId}`);
}