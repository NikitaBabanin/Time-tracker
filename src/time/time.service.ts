import {inject, injectable} from "inversify";
import {ILoggerService} from "../logger/logger.service.interface";
import {TYPES} from "../types";
import {AddTimeDto} from "./dto/add-time.dto";
import {ITimeService, IOperationWithTime} from "./time.service.interface";
import db from '../db';
import {GetTimeDto} from "./dto/get-time.dto";
import {GetTimeAllDto} from "./dto/get-time-all.dto";
import 'reflect-metadata'
import {IUsersRepository} from "../users/users.repository.interface";
import {ITimeRepository} from "./time.repository.interface";

@injectable()
export class TimeService implements ITimeService {

    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService,
        @inject(TYPES.UserRepository) private userRepository: IUsersRepository,
        @inject(TYPES.TimeRepository) private timeReporitory: ITimeRepository
    ) {
    }

    private async getUserByName(username: string) {
        return await this.userRepository.getUserByName(username);
    }

    private async getUsernameById(user_id: number) {
        const username = await this.userRepository.getUserById(user_id);
        const result = username.rows[0].username;
        return result;
    }

    private async allTimeBySelectedDate(user_id: number, date: string): Promise<number> {
        const time = await this.timeReporitory.allTimeBySelectedDate(user_id, date);

        const result = Number(time.rows[0].sum);

        if (!result) return 0;

        return result;
    }

    private async getTimeMapData(time: any) {
        return await time.rows.map((item: any) => {
            const {date, sum, description} = item;
            return {
                date,
                hours: +sum,
                description,
            };
        });

    }


    async addTime({username, date, hours, description}: AddTimeDto): Promise<any[]> {
        const getUser = await this.getUserByName(username);

        if (!getUser.rows[0]) {
            throw new Error("This user is not in database.");
        }

        const user_id = getUser.rows[0].id;

        const allTimeBySelectedDate = await this.allTimeBySelectedDate(
            user_id,
            date
        );

        const addedNewTime = allTimeBySelectedDate + hours;

        if (addedNewTime > 8) {
            throw new Error("You are trying to add more than 8 hours per number.");
        }

        await this.timeReporitory.saveTime({user_id, date, hours, description});

        const allUserTime = await this.timeReporitory.getAllUserTime(user_id);

        return allUserTime.rows

    }

    async getTime({
                      username,
                      startdate,
                      enddate
                  }: GetTimeDto): Promise<{ date: string, hours: number, description: string }[]> {

        const getUser = await this.getUserByName(username);

        if (!getUser.rows[0]) {
            throw new Error("An error has occurred try again");
        }

        const user_id = getUser.rows[0].id;

        const getTime = await this.timeReporitory.getTime({user_id, startdate, enddate});

        const updateDateStructur = this.getTimeMapData(getTime)
        return updateDateStructur

    }

    async getTimeAll({
                         startdate,
                         enddate
                     }: GetTimeAllDto): Promise<any | null> {

        const getTimeAll:any  = await this.timeReporitory.getTimeAll({startdate,enddate})

        return await Promise.all(
            getTimeAll.rows.map((item:any) => {
                const {user_id, sum, description} = item;

                return this.getUsernameById(user_id).then((username) => {
                    return {
                        username,
                        hours: +sum,
                        description,
                    };
                });
            })
        ).then((allTime:any) => {
            return allTime
        });
    }
}
