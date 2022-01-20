import {Request, Response, NextFunction} from 'express';
import {AddTimeDto} from "./dto/add-time.dto";
import { GetTimeAllDto } from './dto/get-time-all.dto';
import {GetTimeDto} from "./dto/get-time.dto";

export interface ITimeService {
    addTime: (dto: AddTimeDto) => Promise<any[] >;
    getTime: (dto: GetTimeDto) => Promise< {date: any, hours: number, description: any}[]>;
    getTimeAll: (dto:GetTimeAllDto) => Promise< {username: string, hours: number, description: string}[]>;
}

export interface IOperationWithTime  {
    date:string,
    hours:number,
    description:string
}

