import {IsString, IsNumber} from 'class-validator';

export class AddTimeDto {
    @IsString({message: "Username not specified"})
    username: string;

    @IsString({message: "Date not specified"})
    date: string;

    @IsNumber({},{message: "Hours not specified"})
    hours: number;

    @IsString({message: "Description not specified"})
    description: string;
}
