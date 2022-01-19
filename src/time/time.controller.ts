import {Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types'
import {LoggerService} from '../logger/logger.service';
import {ILoggerService} from '../logger/logger.service.interface'
import {BaseController} from '../common/base.controller';
import {ITimeController} from './time.controller.interface';
import db from '../db';
import 'reflect-metadata'
import { AddTimeDto } from './dto/add-time.dto';
import { GetTimeDto } from './dto/get-time.dto';

@injectable()
export class TimeController extends BaseController implements ITimeController {

    constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
        super(loggerService)
        this.bindRoutes([
            {path: '/add-time', method: 'post', func: this.addTime},
            {path: '/get-time/:username', method: 'get', func: this.getTime},
            {path: '/get-time-all', method: 'get', func: this.getTimeAll},
        ])
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

    async addTime({body}: Request<{},{},AddTimeDto>, res: Response, next: NextFunction): Promise<void> {

        const {username, date, hours, description} = body;

        const getUser = await this.getUserByName(username);

        if (!getUser.rows[0]) {
            this.ok(res, {message: "This user is not in database.", data: {}});
            return;
        }

        const user_id = getUser.rows[0].id;

        const allTimeBySelectedDate = await this.allTimeBySelectedDate(
            user_id,
            date
        );

        const addedNewTime = allTimeBySelectedDate + hours;

        if (addedNewTime > 8) {
            this.ok(res, {
                message: "Error",
                date: "You are trying to add more than 8 hours per number.",
            });

            return;
        }

        await db.query(
            "INSERT INTO time (date, hours,description, user_id) values ($1, $2, $3, $4) RETURNING *",
            [date, hours, description, user_id]
        );

        const allUserTime = await this.getAllUserTime(user_id);

        this.ok(res, {message: 'Add time.', data: allUserTime.rows});
    }

    async getTime({query,body}: Request<{},{},GetTimeDto>, res: Response, next: NextFunction): Promise<void> {

        const startdate: string = query.startdate as string
        const enddate: string = query.enddate as string;

        const {username} = body;

        const getUser = await this.getUserByName(username);

        if (!getUser.rows[0]) {
            this.ok(res, {message: "This user is not in database.", data: {}});
            return;
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

        this.ok(res, {
            message: `Time between ${startdate} and ${enddate}`,
            data: updateDateStructur,
        });
    }

    async getTimeAll({query}: Request, res: Response, next: NextFunction): Promise<void> {
        const startdate: string = query.startdate as string;
        const enddate: string = query.enddate as string;

        const getTimeAll = await db.query(
            "SELECT user_id,SUM(hours),string_agg(description,'/') description from time where date >= $1 and date <= $2 group by user_id",
            [startdate, enddate]
        );

        Promise.all(
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
            this.ok(res, {message: "All time", date: allTime});
        });
    }
}



