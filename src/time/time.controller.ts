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
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class TimeController extends BaseController implements ITimeController {

    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.TimeService) private timeService: ITimeService,
    ) {
        super(loggerService)
        this.bindRoutes([
            {path: '/add-time', method: 'post', func: this.addTime,middlewares: [new ValidateMiddleware(AddTimeDto)]},
            {path: '/get-time/:username', method: 'get', func: this.getTime,middlewares: [new ValidateMiddleware(GetTimeDto)]},
            {path: '/get-time-all', method: 'get', func: this.getTimeAll,middlewares: [new ValidateMiddleware(GetTimeAllDto)]},
        ])
    }

    async addTime({body}: Request<{}, {}, AddTimeDto>, res: Response, next: NextFunction): Promise<void | null> {

        await this.timeService.addTime(body)
            .then((result) => {
                if (!result) return new Error('Error');
                this.ok(res, {message: 'Add time.', data: result});
            })
            .catch((error) => {
                next(new HTTPError(404, error.message, 'addTime'));
            })

    }

    async getTime(req: Request, res: Response, next: NextFunction): Promise<void | null> {
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

    async getTimeAll({query}: Request<{}, {}, GetTimeAllDto>, res: Response, next: NextFunction): Promise<void | null> {

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



