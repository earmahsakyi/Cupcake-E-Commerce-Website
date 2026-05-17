import { Document } from "mongoose";
import { Request } from "express";

export interface IAdmin extends Document {
  name: string;
  email: string;
  role: string;
  password: string;

  lastLogin?: Date;

  isActive: boolean;

  resetToken?: string;
  OTP?: string;

  resetOTPExpiry?: Date ;
  OTPversion: number;

  resetTokenExpiry?: Date ;
  tokenVersion: number;

  loginAttempts: number;

  lockUntil?: Date | null;
  lockLevel: number;

  lockedManually: boolean;
}

export interface AuthRequest extends Request {
    admin?: IAdmin;
}