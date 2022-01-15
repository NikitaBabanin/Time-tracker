import express, {Express} from 'express';
import {Server} from 'http';
import {LoggerService} from './logger/logger.service';
import {UserController} from './users/users.controller';
import {TimeController} from './time/time.controller';
import {ExeptionFilter} from './errors/exeption.filter';

export class App {
    app: Express;
    port: number;
    server: Server;
    logger: LoggerService;
    userController: UserController;
    timeController: TimeController;
    exeptionFilter: ExeptionFilter;

    constructor(logger: LoggerService, userController: UserController, timeController: TimeController, exeptionFilter: ExeptionFilter) {
        this.app = express();
        this.port = 8003;
        this.logger = logger;
        this.userController = userController;
        this.timeController = timeController;
        this.exeptionFilter = exeptionFilter;
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
        this.app.use('/time', this.timeController.router);
    }

    useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
    }

    public async init(): Promise<void> {
        this.useRoutes()
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on port ${this.port} `)
    }
}

