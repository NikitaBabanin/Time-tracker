import { User } from "./user.entity";

export interface IUsersRepository{
    create:(user:User) => Promise<IUserRepositoryReqDb>;
    find:(email: string) => Promise<IUserRepositoryReqDb | null>;
    getUserById: (user_id:number) => Promise<IUserRepositoryReqDb | null>;
    getUserByName: (username: string) => Promise<IUserRepositoryReqDb | null>;
}

export interface IUserRepositoryReqDb{
    command: string,
    rowCount: number,
    oid: any,
    rows: any[],
    fields: any[],
    RowCtor?: any,
    rowAsArray?: boolean
}
