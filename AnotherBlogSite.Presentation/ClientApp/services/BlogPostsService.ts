import httpClient from "./RequestProvider.ts";
import BlogPost from "../models/BlogPost.ts";
import Guid from "../models/Guid.ts";

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    const response = await httpClient.get<BlogPost[]>('/BlogPosts');
    
    return  response.data;
}

export const getBlogPost = async (blogPostId: Guid): Promise<BlogPost> => {
    const response = await httpClient.get<BlogPost>(`/BlogPosts/${blogPostId}`);

    return response.data;
}

export interface CreateBlogPost {
    title: string;
    content: string;
}

export const createBlogPost = async (createBlogPost: CreateBlogPost): Promise<BlogPost> => {
    const response = await httpClient.post<BlogPost>('/BlogPosts', createBlogPost);

    return response.data;
}

export interface UpdateBlogPost {
    blogPostId: Guid;
    title: string;
    content: string;
}

export const updateBlogPost = async (updateBlogPost: UpdateBlogPost): Promise<BlogPost> => {
    const response = await httpClient.put<BlogPost>('/BlogPosts', updateBlogPost);
    
    return response.data;
}

export const deleteBlogPost = async (blogPostId: Guid): Promise<void> => {
    await httpClient.delete<void>(`/BlogPosts/${blogPostId}`);
}