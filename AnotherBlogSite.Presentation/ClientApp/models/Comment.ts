import User from "./User";
import Guid from "./Guid";

export default interface Comment {
    id: Guid;
    content: string;
    createdDate: Date;
    authorId: Guid;
    blogPostId: Guid;
    author: User;
}