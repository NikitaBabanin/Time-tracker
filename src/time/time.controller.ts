import {Request, Response, NextFunction} from 'express';
import { inject, injectable } from 'inversify';
import {TYPES} from '../types'
import {LoggerService} from '../logger/logger.service';
import {ILoggerService} from '../logger/logger.service.interface'
import {BaseController} from '../common/base.controller';
import {ITimeController} from './time.controller.interface';
import 'reflect-metadata'

@injectable()
export class TimeController extends BaseController implements ITimeController{

    constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
        super(loggerService)
        this.bindRoutes([
            {path: '/add-time', method: 'post', func: this.addTime},
            {path: '/get-log', method: 'post', func: this.getLog},
            {path: '/get-log-all', method: 'post', func: this.getLogAll},
        ])
    }

    addTime(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'Add time.');
    }

    getLog(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'Get log.');
    }

    getLogAll(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'Get log all');
    }
}
