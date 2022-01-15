import express, {Express} from 'express';
import {Server} from 'http';
import {LoggerService} from './logger/logger.service';
import {UserController} from './users/users.controller';
import {TimeController} from './time/time.controller';

export class App {
    app: Express;
    port: number;
    server: Server;
    logger: LoggerService;
    userController: UserController;
    timeController: TimeController

    constructor(logger: LoggerService, userController: UserController, timeController:TimeController) {
        this.app = express();
        this.port = 8002;
        this.logger = logger;
        this.userController = userController;
        this.timeController = timeController;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
        this.app.use('/time', this.timeController.router);
    }

    public async init() {
        this.useRoutes()
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on port ${this.port} `)
    }
}

