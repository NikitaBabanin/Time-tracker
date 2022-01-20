import { User } from "./user.entity";

export interface IUsersRepository{
    create:(usernaem:string,password:string) => Promise<any>;
    find:(username: string) => Promise<any | null>;
    getUserById: (user_id:number) => Promise<any | null>;
    getUserByName: (username: string) => Promise<any | null>;
}
