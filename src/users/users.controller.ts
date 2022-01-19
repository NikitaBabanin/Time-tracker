import { NextFunction, Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILoggerService } from '../logger/logger.service.interface';
import { IUsersController } from './users.controller.interface';
import { TYPES } from '../types';
import db from '../db';
import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

@injectable()
export class UserController extends BaseController implements IUsersController {
    constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
        super(loggerService);
        this.bindRoutes([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login },
        ]);
    }

    login(req: Request<{},{}, UserLoginDto>, res: Response, next: NextFunction): void {
        this.ok(res, 'Login');
    }

    async register({body}: Request<{},{},UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const {username, password} = body;

        const newUser = new User(username);
        await newUser.setPassword(password);

        const newPerson = await db.query('INSERT INTO person (username, password) values ($1, $2) RETURNING *',[newUser.username, newUser.password])
        this.ok(res, {message:"Register", data:newPerson.rows[0]});
    }
}
