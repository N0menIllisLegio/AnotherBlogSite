import Guid from "./Guid";
import User from "./User";
import Comment from "./Comment";

export default interface BlogPost {
    id: Guid;
    title: string;
    content: string;
    createdDate: Date;
    authorId: Guid;
    author: User;
    comments: Comment[] | null;
}