import { injectable } from "inversify";
import db from "../db";
import {IUsersRepository} from "./users.repository.interface";
import 'reflect-metadata'

@injectable()
export class UsersRepository implements IUsersRepository {

    async create(username: string, password: string): Promise<any> {
        const newPerson = await db.query('INSERT INTO person (username, password) values ($1, $2) RETURNING *', [username, password])
        return newPerson.rows[0]
    }

    async find() {

    }

    async getUserById(user_id:number): Promise<any | null>{
        return await db.query("SELECT username FROM person WHERE id=$1", [
            user_id,
        ]);
    }

    async getUserByName(username: string): Promise<any | null>{
        return await db.query("SELECT * FROM person where username = $1", [
            username,
        ]);
    }
}
