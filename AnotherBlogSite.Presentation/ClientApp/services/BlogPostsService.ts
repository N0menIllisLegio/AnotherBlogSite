﻿import IBlogPost from "../models/IBlogPost.ts";
import Guid from "../models/Guid.ts";
import IRequestProvider from "../models/IRequestProvider.ts";

export interface CreateBlogPost {
    title: string;
    content: string;
}

export interface UpdateBlogPost {
    blogPostId: Guid;
    title: string;
    content: string;
}

export default class BlogPostsService {
    #requestProvider: IRequestProvider;

    constructor(requestProvider: IRequestProvider) {
        this.#requestProvider = requestProvider;
    }

    getBlogPosts = async (): Promise<IBlogPost[]> => {
        const data = await this.#requestProvider.get<IBlogPost[]>('/BlogPosts');

        data.forEach(x => x.createdDate = new Date(x.createdDate));

        return data;
    }

    getBlogPost = async (blogPostId: Guid): Promise<IBlogPost> => {
        const data = await this.#requestProvider.get<IBlogPost>(`/BlogPosts/${blogPostId}`);

        data.createdDate = new Date(data.createdDate);
        data.comments?.forEach(comment => comment.createdDate = new Date(comment.createdDate));

        return data;
    }

    createBlogPost = async (createBlogPost: CreateBlogPost): Promise<IBlogPost> => {
        const data = await this.#requestProvider.post<CreateBlogPost, IBlogPost>('/BlogPosts', createBlogPost);

        data.createdDate = new Date(data.createdDate);
        data.comments?.forEach(comment => comment.createdDate = new Date(comment.createdDate));

        return data;
    }

    updateBlogPost = async (updateBlogPost: UpdateBlogPost): Promise<IBlogPost> => {
        const data = await this.#requestProvider.put<UpdateBlogPost, IBlogPost>('/BlogPosts', updateBlogPost);

        data.createdDate = new Date(data.createdDate);
        data.comments?.forEach(comment => comment.createdDate = new Date(comment.createdDate));

        return data;
    }

    deleteBlogPost = async (blogPostId: Guid): Promise<void> => {
        console.log(this.#requestProvider);
        await this.#requestProvider.delete<null>(`/BlogPosts/${blogPostId}`);
    }
}