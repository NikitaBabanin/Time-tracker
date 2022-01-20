import {IsString} from 'class-validator';
export class GetTimeAllDto{
    @IsString({message:"Start-date not specified"})
    startdate: string;

    @IsString({message:"End-date not specified"})
    enddate: string;
}
