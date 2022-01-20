import {IsString} from 'class-validator';

export class UserRegisterDto{
    @IsString({message: "Username not specified"})
    username: string;
    @IsString({message: "Password not specified"})
    password: string;
}

