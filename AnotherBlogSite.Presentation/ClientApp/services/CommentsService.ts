import IComment from "../models/IComment.ts";
import Guid from "../models/Guid.ts";
import IRequestProvider from "../models/IRequestProvider.ts";

export interface CreateComment {
    blogPostId: Guid;
    content: string;
}

export interface UpdateComment {
    commentId: Guid;
    content: string;
}

export default class CommentsService {
    #requestProvider: IRequestProvider;

    constructor(requestProvider: IRequestProvider) {
        this.#requestProvider = requestProvider;
    }

    getBlogPostComments = async (blogPostId: Guid): Promise<IComment[]> => {
        const data = await this.#requestProvider.get<IComment[]>(`/Comments/${blogPostId}`);

        data.forEach(comment => comment.createdDate = new Date(comment.createdDate));

        return data;
    }

    createComment = async (createComment: CreateComment): Promise<IComment> => {
        const data = await this.#requestProvider.post<CreateComment, IComment>('/Comments', createComment);

        data.createdDate = new Date(data.createdDate);

        return data;
    }

    updateComment = async (updateComment: UpdateComment): Promise<IComment> => {
        const data = await this.#requestProvider.put<UpdateComment, IComment>('/Comments', updateComment);

        data.createdDate = new Date(data.createdDate);

        return data;
    }

    deleteComment = async (commentId: Guid): Promise<void> => {
        await this.#requestProvider.delete<null>(`/Comments/${commentId}`);
    }
}