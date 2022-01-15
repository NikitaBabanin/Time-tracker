import {Request, Response, NextFunction} from 'express';
import {IExeptionFilter} from './exeption.filter.interface';
import {LoggerService} from '../logger/logger.service'
import {HTTPError} from './http-error.class';

export class ExeptionFilter implements IExeptionFilter {
    logger:LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
        if (err instanceof HTTPError) {
            this.logger.error(`[${err.context}] Error ${err.statusCode} : ${err.message}`);
            res.status(err.statusCode).send({ err: err.message });
        } else {
            this.logger.error(`${err.message}`);
            res.status(500).send({ err: `${err.message}` });
        }
    }
}