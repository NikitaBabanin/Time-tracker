import {App} from './app';
import {LoggerService} from './logger/logger.service';
import {UserController} from './users/users.controller';
import {TimeController} from './time/time.controller';

async function bootstrap() {
    const logger = new LoggerService();
    const app = new App(logger, new UserController(logger), new TimeController(logger));
    await app.init();
}

bootstrap();
