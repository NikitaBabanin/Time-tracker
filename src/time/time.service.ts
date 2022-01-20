import {inject, injectable} from "inversify";
import {ILoggerService} from "../logger/logger.service.interface";
import {TYPES} from "../types";
import {AddTimeDto} from "./dto/add-time.dto";
import {ITimeService, IOperationWithTime} from "./time.service.interface";
import db from '../db';
import {GetTimeDto} from "./dto/get-time.dto";
import {GetTimeAllDto} from "./dto/get-time-all.dto";
import 'reflect-metadata'

@injectable()
export class TimeService implements ITimeService {

    constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
    }

    private async getUserByName(username: string) {
        return await db.query("SELECT * FROM person where username = $1", [
            username,
        ]);
    }

    private async getUsernameById(user_id: number) {
        const username = await db.query("SELECT username FROM person WHERE id=$1", [
            user_id,
        ]);
        const result = username.rows[0].username;
        return result;
    }

    private async allTimeBySelectedDate(user_id: number, date: string) {
        const time = await db.query(
            "SELECT SUM(hours) FROM time WHERE user_id=$1 and date=$2",
            [user_id, date]
        );

        const result = parseInt(time.rows[0].sum);

        if (!result) return 0;

        return result;
    }

    private async getAllUserTime(user_id: number) {
        return await db.query("SELECT * from time where user_id = $1", [user_id]);
    }

    async addTime({username, date, hours, description}: AddTimeDto): Promise<any[]> {
        const getUser = await this.getUserByName(username);

        if (!getUser.rows[0]) {
            throw new Error("This user is not in database.");
        }

        const user_id = getUser.rows[0].id;

        const allTimeBySelectedDate = await this.allTimeBySelectedDate(
            user_id,
            date
        );

        const addedNewTime = allTimeBySelectedDate + hours;

        if (addedNewTime > 8) {
            throw new Error("You are trying to add more than 8 hours per number.");
        }

        await db.query(
            "INSERT INTO time (date, hours,description, user_id) values ($1, $2, $3, $4) RETURNING *",
            [date, hours, description, user_id]
        );

        const allUserTime = await this.getAllUserTime(user_id);

        return allUserTime.rows

    }

    async getTime({
                      username,
                      startdate,
                      enddate
                  }: GetTimeDto): Promise< {date: any, hours: number, description: any}[]> {

        const getUser = await this.getUserByName(username);
        console.log('getuser : ', username, startdate, enddate)
        if (!getUser.rows[0]) {
            throw new Error("An error has occurred try again");
        }

        const user_id = getUser.rows[0].id;

        const getTime = await db.query(
            "SELECT date,sum(hours),string_agg(description,'/') description from time where user_id = $1 and date >= $2 and date <= $3 group by date",
            [user_id, startdate, enddate]
        );

        const updateDateStructur = getTime.rows.map((item) => {
            const {date, sum, description} = item;
            return {
                date,
                hours: +sum,
                description,
            };
        });

        return updateDateStructur

    }

    async getTimeAll({
                         startdate,
                         enddate
                     }: GetTimeAllDto): Promise< {username: string, hours: number, description: string}[]> {

        const getTimeAll = await db.query(
            "SELECT user_id,SUM(hours),string_agg(description,'/') description from time where date >= $1 and date <= $2 group by user_id",
            [startdate, enddate]
        );

        return await Promise.all(
            getTimeAll.rows.map((item) => {
                const {user_id, sum, description} = item;

                return this.getUsernameById(user_id).then((username) => {
                    return {
                        username,
                        hours: +sum,
                        description,
                    };
                });
            })
        ).then((allTime) => {
            return allTime
        });
    }
}
