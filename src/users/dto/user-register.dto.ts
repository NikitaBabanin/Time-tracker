import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
    @IsEmail({}, { message: 'Email not specified' })
    email: string;

    @IsString({ message: 'Password not specified' })
    password: string;

    @IsString({ message: 'Username not specified' })
    username: string;
}
