import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api.types.js";


export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError'
    }

};

export const errorHandler = (err: unknown, req: Request, res:Response, next: NextFunction): void => {
    console.error(err);
    
    if(err instanceof AppError) {
        const response: ApiResponse<never> = {
            success: false,
            error: err.message
        }
        res.status(err.statusCode).json(response)
        return;
    }

    const response: ApiResponse<never> = {
        success: false,
        error: 'Internal server error'
    }
    res.status(500).json(response)
}