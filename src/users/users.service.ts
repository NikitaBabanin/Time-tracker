import { injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./users.service.interface";
import db from '../db';
import 'reflect-metadata'

@injectable()
export class UsersService implements IUserService{

    async createUser({username, password}:UserRegisterDto): Promise<User | null>{
        const newUser = new User(username);
        await newUser.setPassword(password);
        //later <newPerson> will be transferred to the repository.
        const newPerson = await db.query('INSERT INTO person (username, password) values ($1, $2) RETURNING *',[newUser.username, newUser.password])
        return newPerson.rows[0]
    }

    async validateUser(dto:UserLoginDto):Promise<boolean>{
        return true;
    }
}
