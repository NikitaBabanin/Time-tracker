import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";

export interface IUserService{
    createUser: (dto: UserRegisterDto) => Promise <IUserSchema | null>;
    validateUser: (dto: UserLoginDto) => Promise <boolean | null>;
    getUserInfo: (email:string) => Promise <IUserSchema | null>;
}

export interface IUserSchema{
    id:number,
    email: string,
    username: string,
    password: string
}
