import {NextFunction, Request, Response} from 'express';
import {BaseController} from '../common/base.controller';
import {LoggerService} from '../logger/logger.service';
import {IUsersController} from './users.controller.interface'

export class UserController extends BaseController implements IUsersController{
    constructor(
        logger: LoggerService
    ) {
        super(logger);
        this.bindRoutes([
            {path: '/register', method: 'post', func: this.register},
            {path: '/login', method: 'post', func: this.login},
        ])
    }

    login(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'login');
    }

    register(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'register');
    }
}
