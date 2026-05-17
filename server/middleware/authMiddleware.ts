import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { AppError } from "./errorHandler.js";
import { AuthRequest, IAdmin } from "../types/admin.types.js";


export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {

    const token = req.cookies.token;

    if (!token) {
        throw new AppError('Not authorized',401)
    }
    try{

         const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
         req.admin = decoded as IAdmin;
         next();

    } catch(err) {
         throw new AppError('Token is not valid',401)
    }

   
}