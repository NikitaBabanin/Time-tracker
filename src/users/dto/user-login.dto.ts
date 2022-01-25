import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
    @IsEmail({}, { message: 'Email not specified' })
    email: string;

    @IsString({message: 'Password not specified'})
    password: string;
}
