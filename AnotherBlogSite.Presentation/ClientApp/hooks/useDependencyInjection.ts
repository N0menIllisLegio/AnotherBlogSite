import {BlogPostsService} from "../services/BlogPostsService.ts";
import {CommentsService} from "../services/CommentsService.ts";
import useRequestProvider from "./useRequestProvider.ts";

export const useBlogPostsService = (): BlogPostsService => {
    const requestProvider = useRequestProvider();

    return new BlogPostsService(requestProvider);
}

export const useCommentsService = (): CommentsService => {
    const requestProvider = useRequestProvider();

    return new CommentsService(requestProvider);
}
