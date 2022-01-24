import { injectable } from "inversify";
import db from "../db";
import { AddTimeDto } from "./dto/add-time.dto";
import { GetTimeAllDto } from "./dto/get-time-all.dto";
import { GetTimeDto } from "./dto/get-time.dto";
import {IGetTime, ISaveTime, ITimeRepository, IUserRepositoryReqDb } from "./time.repository.interface";
import 'reflect-metadata'

@injectable()
export class TimeRepository implements ITimeRepository{
    constructor() {
    }

    async saveTime(payload:ISaveTime): Promise<IUserRepositoryReqDb | null>{
        const {user_id, date, hours, description} = payload

        return await db.query(
            "INSERT INTO time (date, hours,description, user_id) values ($1, $2, $3, $4) RETURNING *",
            [date, hours, description, user_id]
        );
    }

    async getTime(payload:IGetTime): Promise<IUserRepositoryReqDb | null>{
        const {user_id,startdate,enddate} = payload;

        return await db.query(
            "SELECT date,sum(hours),string_agg(description,'/') description from time where user_id = $1 and date >= $2 and date <= $3 group by date",
            [user_id, startdate, enddate]
        );
    }

    async getTimeAll(payload: GetTimeAllDto): Promise<IUserRepositoryReqDb | null>{
        const {startdate,enddate} = payload;
        return await db.query(
            "SELECT user_id,SUM(hours),string_agg(description,'/') description from time where date >= $1 and date <= $2 group by user_id",
            [startdate, enddate]
        );
    }

    async allTimeBySelectedDate(user_id:number, date:string):Promise<IUserRepositoryReqDb | null>{
        return await db.query(
            "SELECT SUM(hours) FROM time WHERE user_id=$1 and date=$2",
            [user_id, date]
        );
    }

    async getAllUserTime(user_id:number):Promise<IUserRepositoryReqDb | null>{
        return await db.query("SELECT * from time where user_id = $1", [user_id]);
    }

}
