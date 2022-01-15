import {Response, Router} from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {ILoggerService} from '../logger/logger.service.interface';
import {IControllerRoute, ExpressReturnType} from './route.interface';
export {Router} from 'express';
import 'reflect-metadata'

@injectable()
export abstract class BaseController {
    private readonly _router: Router;

    constructor(@inject(TYPES.ExeptionFilter) private logger: ILoggerService) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T): ExpressReturnType {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T): ExpressReturnType {
        return this.send<T>(res, 200, message);
    }

    public created(res: Response): ExpressReturnType {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]): void {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        }
    }
}
