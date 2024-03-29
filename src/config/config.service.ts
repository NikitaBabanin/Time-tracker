import {IConfigService} from "./config.service.interface";
import {config, DotenvConfigOutput, DotenvParseOutput} from 'dotenv'
import { ILoggerService } from "../logger/logger.service.interface";
import { TYPES } from "../types";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService
    ) {
        const result: DotenvConfigOutput = config();
        if(result.error){
            this.logger.error('Could not read the file ".env" or it is missing')
        }else{
            this.logger.log("Configuration '.env' is loaded.")
            this.config = result.parsed as DotenvParseOutput;
        }
    }

    get(key: string): string {
        return this.config[key];
    }
}
