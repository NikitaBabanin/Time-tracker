import {Container, ContainerModule, interfaces} from 'inversify';
import {App} from './app';
import {LoggerService} from './logger/logger.service';
import {UserController} from './users/users.controller';
import {TimeController} from './time/time.controller';
import {ExeptionFilter} from './errors/exeption.filter';
import {IExeptionFilter} from './errors/exeption.filter.interface';
import {ILoggerService} from './logger/logger.service.interface';
import {IUsersController} from './users/users.controller.interface';
import {ITimeController} from './time/time.controller.interface';
import {TYPES} from './types'
import 'reflect-metadata'
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) =>{
    bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
    bind<IUsersController>(TYPES.UserController).to(UserController).inSingletonScope();
    // bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope()
    bind<ITimeController>(TYPES.TimeController).to(TimeController);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<App>(TYPES.Application).to(App);
});


function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return {appContainer, app};
}

export const { appContainer, app} = bootstrap();
