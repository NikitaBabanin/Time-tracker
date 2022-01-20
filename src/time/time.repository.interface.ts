import { AddTimeDto } from "./dto/add-time.dto";
import { GetTimeAllDto } from "./dto/get-time-all.dto";
import { GetTimeDto } from "./dto/get-time.dto";

export interface ITimeRepository{
    saveTime: (dto: ISaveTime) => Promise<any | null>
    getTime: (dto: IGetTime) => Promise<any | null>
    getTimeAll: (dto: GetTimeAllDto) => Promise<void | null>
    allTimeBySelectedDate:(user_id:number, date:string) => Promise<any | null>
    getAllUserTime: (user_id:number) => Promise<any>
}

export interface ISaveTime{
    user_id: number,
    date: string,
    hours: number,
    description: string
}

export interface IGetTime{
    user_id: number,
    startdate: string,
    enddate:string
}
