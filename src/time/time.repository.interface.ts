import { AddTimeDto } from "./dto/add-time.dto";
import { GetTimeAllDto } from "./dto/get-time-all.dto";
import { GetTimeDto } from "./dto/get-time.dto";

export interface ITimeRepository{
    saveTime: (dto: ISaveTime) => Promise<ITimeRepositoryReqDb | null>
    getTime: (dto: IGetTime) => Promise<ITimeRepositoryReqDb | null>
    getTimeAll: (dto: GetTimeAllDto) => Promise<ITimeRepositoryReqDb | null>
    allTimeBySelectedDate:(user_id:number, date:string) => Promise<ITimeRepositoryReqDb | null>
    getAllUserTime: (user_id:number) => Promise<ITimeRepositoryReqDb | null>
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

export interface ITimeRepositoryReqDb{
    command: string,
    rowCount: number,
    oid: any,
    rows: any[],
    fields: any[],
    RowCtor?: any,
    rowAsArray?: boolean
}
