import {IsString} from 'class-validator';
export class GetTimeDto{
    @IsString({message:"Username not specified"})
    username: string;

    @IsString({message:"Start-date not specified"})
    startdate: string;

    @IsString({message:"End-date not specified"})
    enddate: string;
}
