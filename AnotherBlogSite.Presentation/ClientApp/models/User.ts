import Guid from "./Guid";

export default interface User {
    id: Guid;
    email: string;
    firstName: string;
    lastName: string;
}