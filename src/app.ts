import express, { Express } from 'express';
import { Server } from 'http';
import {LoggerService} from './logger/logger.service'

export class App {
    app: Express;
    port: number;
    server: Server;
    logger: LoggerService;

    constructor(logger: LoggerService) {
        this.app = express();
        this.port = 8002;
        this.logger = logger;
    }

    public async init(){
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on port ${this.port} `)
    }
}
