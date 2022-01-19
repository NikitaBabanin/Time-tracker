import {Request, Response, NextFunction} from 'express';

export interface ITimeController {
    addTime: (req: Request, res: Response, next: NextFunction) => void;
    getTime: (req: Request, res: Response, next: NextFunction) => void;
    getTimeAll: (req: Request, res: Response, next: NextFunction) => void;
}
