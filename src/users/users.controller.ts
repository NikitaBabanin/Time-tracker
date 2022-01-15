import { NextFunction, Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILoggerService } from '../logger/logger.service.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUsersController } from './users.controller.interface';
import 'reflect-metadata'

@injectable()
export class UserController extends BaseController implements IUsersController {
    constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
        super(loggerService);
        this.bindRoutes([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login },
        ]);
    }

    login(req: Request, res: Response, next: NextFunction): void {
        // this.ok(res, 'Login');
        next(new HTTPError(409, 'Error loginn', 'Login'));
    }

    register(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'Register');
    }
}
