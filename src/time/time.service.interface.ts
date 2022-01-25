import {Request, Response, NextFunction} from 'express';
import {AddTimeDto} from "./dto/add-time.dto";
import { GetTimeAllDto } from './dto/get-time-all.dto';
import {GetTimeDto} from "./dto/get-time.dto";

export interface ITimeService {
    addTime: (dto: AddTimeDto) => Promise<IAddTime[] | []>;
    getTime: (dto: GetTimeDto) => Promise< IGetTime[] | null>;
    getTimeAll: (dto:GetTimeAllDto) => Promise< IGetTimeAll[] | null>;
}

export interface IOperationWithTime  {
    date:string,
    hours:number,
    description:string
}

export interface IAddTime{
    id: number,
    date: string,
    description: string,
    hours: number,
    user_id: number
}

export interface IGetTime {
    date:string,
    hours: number,
    description:string,
}

export interface IGetTimeAll {
    username:string,
    hours: number,
    description:string,
}
