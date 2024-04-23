import IUser from "./IUser.ts";
import Guid from "./Guid";

export default interface IComment {
    id: Guid;
    content: string;
    createdDate: Date;
    authorId: Guid;
    blogPostId: Guid;
    author: IUser;
}