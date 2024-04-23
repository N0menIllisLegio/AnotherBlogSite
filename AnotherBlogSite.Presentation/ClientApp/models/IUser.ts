import Guid from "./Guid";

export default interface IUser {
    id: Guid;
    email: string;
    firstName: string;
    lastName: string;
}