import { Response, Request, NextFunction } from "express";
import { AppError } from "./errorHandler.js";

export const checkKey = (req: Request, res: Response, next: NextFunction) => {
    const key = (req.body.secretKey).trim();

    if (!key || key !== process.env.SECRET_KEY as string) {
        throw new AppError('Invalid or missing secret Key',401) 
    }
    next();
}