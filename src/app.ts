import express, {Express} from 'express';
import {Server} from 'http';
import {inject, injectable} from 'inversify';
import {ILoggerService} from './logger/logger.service.interface'
import {UserController} from './users/users.controller';
import {TimeController} from './time/time.controller';
import {ExeptionFilter} from './errors/exeption.filter';
import {TYPES} from './types'
import { IExeptionFilter } from './errors/exeption.filter.interface';
import 'reflect-metadata'

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.TimeController) private timeController: TimeController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter
    ) {
        this.app = express();
        this.port = 3007;
    }

    useMiddleware():void{
        this.app.use(express.json());
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
        this.app.use('/time', this.timeController.router);
    }

    useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
    }

    public async init(): Promise<void> {
        this.useMiddleware()
        this.useRoutes()
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on port ${this.port} `)
    }
}

