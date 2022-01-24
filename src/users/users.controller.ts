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
import {ValidateMiddleware} from '../common/validate.middleware';
import {sign} from 'jsonwebtoken';
import {IConfigService} from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUsersController {
    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)]
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthGuard()]
            },
        ]);
    }

    async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.validateUser(req.body);
        if (!result) {
            return next(new HTTPError(401, 'Error auth.', 'Login'));
        }
        const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
        this.ok(res, {jwt});
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        await this.userService.createUser(body)
            .then((result) => {
                if (!result) {
                    return next(new HTTPError(401, 'Error register.', 'Login'));
                }
                this.ok(res, {message: "Register", data: result});
            })
            .catch(error => {
                next(new HTTPError(422, "This user already exists", "Rregister"))
            })
    }

    async info({user}: Request, res: Response, next: NextFunction): Promise<void>{
        const userInfo = await this.userService.getUserInfo(user)
        this.ok(res, {message: "Info", data: {email:userInfo?.email, id:userInfo?.id}});
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign({
                email,
                iat: Math.floor(Date.now() / 1000),
            }, secret, {
                algorithm: 'HS256'
            }, (err, token) => {
                if (err) {
                    reject(err);
                } else if (typeof token === 'string'){
                    resolve(token);
                }
            });
        });
    }
}
