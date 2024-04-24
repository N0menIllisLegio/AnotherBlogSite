import BlogPostsService from "../services/BlogPostsService.ts";
import CommentsService from "../services/CommentsService.ts";
import useAxiosRequestProvider from "./useAxiosRequestProvider.ts";

export const useBlogPostsService = (): BlogPostsService => {
    const requestProvider = useAxiosRequestProvider();

    return new BlogPostsService(requestProvider);
}

export const useCommentsService = (): CommentsService => {
    const requestProvider = useAxiosRequestProvider();

    return new CommentsService(requestProvider);
}
