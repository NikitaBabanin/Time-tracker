import {NextFunction, Response, Request} from 'express';
import {inject, injectable} from 'inversify';
import {BaseController} from '../common/base.controller';
import {HTTPError} from '../errors/http-error.class';
import {ILoggerService} from '../logger/logger.service.interface';
import {IUsersController} from './users.controller.interface';
import {TYPES} from '../types';
import db from '../db';
import 'reflect-metadata';
import {UserLoginDto} from './dto/user-login.dto';
import {UserRegisterDto} from './dto/user-register.dto';
import {User} from './user.entity';
import {IUserService} from './users.service.interface';

@injectable()
export class UserController extends BaseController implements IUsersController {
    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.UserService) private userService: IUserService
    ) {
        super(loggerService);
        this.bindRoutes([
            {path: '/register', method: 'post', func: this.register},
            {path: '/login', method: 'post', func: this.login},
        ]);
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        this.ok(res, 'Login');
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const {username, password} = body;

        await this.userService.createUser(body)
            .then((result) => {
                this.ok(res, {message: "Register", data: result});
            })
            .catch(error => {
                next(new HTTPError(422, "This user already exists","Rregister"))
            })


    }
}
