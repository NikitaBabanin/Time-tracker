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
import {IUserService} from './users/users.service.interface'
import {UsersService} from './users/users.service'
import {TYPES} from './types'
import 'reflect-metadata'
import { ITimeService } from './time/time.service.interface';
import { TimeService } from './time/time.service';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) =>{
    bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService);
    bind<IUsersController>(TYPES.UserController).to(UserController);
    bind<IUserService>(TYPES.UserService).to(UsersService)
    bind<ITimeController>(TYPES.TimeController).to(TimeController);
    bind<ITimeService>(TYPES.TimeService).to(TimeService);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
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
