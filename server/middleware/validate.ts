import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";

export const validateBody = (requiredFields: string[]) => {

    return (req:Request, res: Response, next: NextFunction): void => {
        const missing = requiredFields.filter(
            field => req.body[field] === undefined || req.body[field] === ''
        );

        if(missing.length > 0){
            throw new AppError(
        `Missing required fields: ${missing.join(', ')}`,
        400
            )
        }
        next();
    };
};