import {Request, Response, NextFunction} from 'express';

export interface ITimeController {
    addTime: (req: Request, res: Response, next: NextFunction) => void;
    getLog: (req: Request, res: Response, next: NextFunction) => void;
    getLogAll: (req: Request, res: Response, next: NextFunction) => void;
}
