import {inject, injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import {IUserSchema, IUserService } from "./users.service.interface";
import 'reflect-metadata'
import { TYPES } from "../types";
import { IConfigService } from "../config/config.service.interface";
import { IUsersRepository } from "./users.repository.interface";

@injectable()
export class UsersService implements IUserService{

    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UserRepository) private usersRepository: IUsersRepository
    ) {
    }

    async createUser({email, username, password}:UserRegisterDto): Promise<User | null>{
        const newUser = new User(username,email, password);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));

        const existedUser = await this.usersRepository.find(email);
        if(existedUser?.rowCount){
            return null;
        }

        const newPerson = await this.usersRepository.create(email, username,password);
        return newPerson.rows[0]
    }


    async validateUser({email, password}:UserLoginDto):Promise<boolean>{
        const existedUser = await this.usersRepository.find(email);
        if(!existedUser?.rowCount){
            return false;
        }
        const user = existedUser.rows[0];
        const newUser = new User(user.email, user.username, user.password);
        // return newUser.comparePassword(password);
        return true
    }

    async getUserInfo(email:string):Promise <IUserSchema | null>{
        const user =  await this.usersRepository.find(email);
        return user?.rows[0];
    }

}
