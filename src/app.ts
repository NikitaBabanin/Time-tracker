import express, {Express} from 'express';
import {json, urlencoded} from 'body-parser';
import {Server} from 'http';
import {inject, injectable} from 'inversify';
import {ILoggerService} from './logger/logger.service.interface'
import {UserController} from './users/users.controller';
import {TimeController} from './time/time.controller';
import {ExeptionFilter} from './errors/exeption.filter';
import {TYPES} from './types'
import {IExeptionFilter} from './errors/exeption.filter.interface';
import {ITimeService} from './time/time.service.interface';
import {IUserService} from './users/users.service.interface';
import 'reflect-metadata'
import { IConfigService } from './config/config.service.interface';
import {IUsersController} from './users/users.controller.interface'
import { AuthMiddleware } from './common/auth.middleware';
import pool from './database/db';
@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.TimeController) private timeController: TimeController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.TimeService) private timeService: ITimeService,
        
    ) {
        this.app = express();
        this.port = 3000;
    }

    useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
        this.app.use('/time', this.timeController.router);
    }

    useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
    }

    private dbConnect(){
		pool.connect((err:any,client,done) =>{
			if(err) throw new Error(err);
			console.log('Connected');
		});
	}

    public async init(): Promise<void> {
        this.dbConnect()
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on port ${this.port} `)
    }
}

