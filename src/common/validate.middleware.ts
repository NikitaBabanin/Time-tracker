import {IMiddleware} from "./middleware.interface";
import {Request, Response, NextFunction} from 'express';
import {ClassConstructor, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';

export class ValidateMiddleware implements IMiddleware {

    constructor(private classToValidate: ClassConstructor<object>) {
    }

    execute({body, query, params}: Request, res: Response, next: NextFunction): void {

        const instance = plainToClass(this.classToValidate, {...body, ...query, ...params});
        validate(instance).then(errors => {
            if (errors.length > 0) {
                res.status(422).send(errors)
            } else {
                next();
            }
        })
    }
}
