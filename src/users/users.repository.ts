import { injectable } from "inversify";
import db from "../database/db";
import {IUserRepositoryReqDb, IUsersRepository} from "./users.repository.interface";
import 'reflect-metadata'
import { User } from "./user.entity";

@injectable()
export class UsersRepository implements IUsersRepository {

    async create(user:User): Promise<IUserRepositoryReqDb> {
        return await db.query('INSERT INTO person (email, username, password) values ($1, $2, $3) RETURNING *', [user.email, user.username, user.password])
    }

    async find(email:string): Promise<IUserRepositoryReqDb | null> {
        return await db.query('SELECT * FROM person WHERE email = $1',[email])
    }

    async getUserById(user_id:number): Promise<IUserRepositoryReqDb | null>{
        return await db.query("SELECT username FROM person WHERE id=$1", [
            user_id,
        ]);
    }

    async getUserByName(username: string): Promise<IUserRepositoryReqDb | null>{
        return await db.query("SELECT * FROM person where username = $1", [
            username,
        ]);
    }
}

