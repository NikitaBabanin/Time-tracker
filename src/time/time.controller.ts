import {Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types'
import {LoggerService} from '../logger/logger.service';
import {ILoggerService} from '../logger/logger.service.interface'
import {BaseController} from '../common/base.controller';
import {ITimeController} from './time.controller.interface';
import db from '../db';
import 'reflect-metadata'
import {AddTimeDto} from './dto/add-time.dto';
import {GetTimeDto} from './dto/get-time.dto';
import {ITimeService} from './time.service.interface';
import {GetTimeAllDto} from './dto/get-time-all.dto';
import {HTTPError} from '../errors/http-error.class';

@injectable()
export class TimeController extends BaseController implements ITimeController {

    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.TimeService) private timeService: ITimeService,
    ) {
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

    async addTime({body}: Request<{}, {}, AddTimeDto>, res: Response, next: NextFunction): Promise<void> {

        await this.timeService.addTime(body)
            .then((result) => {
                if (!result) return new Error('Error');
                this.ok(res, {message: 'Add time.', data: result});
            })
            .catch((error) => {
                next(new HTTPError(404, error.message, 'addTime'));
            })

    }

    async getTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        const payload = {
            startdate: req.query.startdate as string,
            enddate: req.query.enddate as string,
            username: req.params.username as string
        }


        await this.timeService.getTime(payload)
            .then((result) => {
                if (!result) return new Error('Error');
                this.ok(res, {
                    message: `Time between ${payload.startdate} and ${payload.enddate}`,
                    data: result,
                });
            })
            .catch((error) => {
                next(new HTTPError(404, error.message, 'getTime'));
            })

    }

    async getTimeAll({query}: Request<{}, {}, GetTimeAllDto>, res: Response, next: NextFunction): Promise<void> {

        const payload = {
            startdate: query.startdate as string,
            enddate: query.enddate as string
        }

        await this.timeService.getTimeAll(payload)
            .then((result) => {
                console.log('result : ', result);
                if (!result) return new Error('Error');
                this.ok(res, {message: "All time", date: result});
            })
            .catch((error) => {
                next(new HTTPError(404, error.message, 'getTimeAll'));
            })
    }
}



