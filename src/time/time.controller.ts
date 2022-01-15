import {Request, Response, NextFunction} from 'express';
import {LoggerService} from '../logger/logger.service';
import {BaseController} from '../common/base.controller';
import {ITimeController} from './time.controller.interface';

export class TimeController extends BaseController implements ITimeController{

    constructor(logger: LoggerService) {
        super(logger)
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
