import Guid from "./Guid";
import IUser from "./IUser.ts";
import IComment from "./IComment.ts";

export default interface IBlogPost {
    id: Guid;
    title: string;
    content: string;
    createdDate: Date;
    authorId: Guid;
    author: IUser;
    comments: IComment[] | null;
}