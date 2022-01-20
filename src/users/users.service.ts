import {inject, injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./users.service.interface";
import db from '../db';
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

    async createUser({username, password}:UserRegisterDto): Promise<User | null>{
        const newUser = new User(username);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));

        const newPerson = await this.usersRepository.create(username,password);
        return newPerson
    }

    async validateUser(dto:UserLoginDto):Promise<boolean>{
        return true;
    }
}
