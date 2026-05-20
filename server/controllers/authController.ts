import jwt from "jsonwebtoken";
import adminModel from "../models/Admin.js";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import sendEmail from "../utils/sendEmail.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { IAdmin,AuthRequest } from "../types/admin.types.js";
import { AppError } from "../middleware/errorHandler.js";
import { generateResetToken } from "../utils/helper.js";

const maxAttempt = 3;
const lockDuration: any = {
    1: 30 * 60 * 1000, //30min
    2: 60 * 60 * 1000 // 1hour
};

export const getLoginUser = asyncHandler(
    async(req: AuthRequest, res: Response) => {
        const admin = await adminModel.findById(req.admin?._id).select('-password');

        if (!admin) {
            throw new AppError('Admin not found', 404);
        }

        res.status(200).json({ success: true, data: admin });
    }
);

export const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        
        const { name, email, password, role } = req.body;

         //check for valid email and password check
        const emailRegex:any = /^[^\s@]+@[^\s@]+.[^/s@]+$/;
        const passwordRegex:any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/
        
        if (!emailRegex.test(email)) {
            throw new AppError('Invalid email format',400)
        };

        if (!passwordRegex.test(password)) {
            throw new AppError('Password must contain uppercase, lowercase, number and special character',400)
        };

        if (password.length < 8){
            throw new AppError('Password must be at least 8 characters',400)
        }

        const cleanedEmail = email.trim().toLowerCase();
        const cleanedName = name.trim(); 

        const  existingAdmin = await adminModel.findOne({ email: cleanedEmail });
        
        if(existingAdmin){
            throw new AppError('Admin already exists!',409);
        };
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt)
        const admin = await adminModel.create({ name: cleanedName, email: cleanedEmail, password: hashPassword, role});

       jwt.sign(
        {_id: admin._id, role: admin.role},
        process.env.JWT_SECRET as string,
        {expiresIn: '1d'},
        (err, token) => {
            if(err) throw err;
            res.cookie('token',token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000
            }).json({
                role: admin.role,
                adminId: admin._id,
                name: admin.name
            })
        }
       )
    }
);

export const loginUser = asyncHandler(
    async ( req: Request, res: Response) => {
        const { email, password} = req.body;

        const cleanedEmail = email.trim().toLowerCase();

        const existingAdmin:IAdmin = await adminModel.findOne({ email: cleanedEmail }).select('+password');

        if(!existingAdmin){
            throw new AppError('Invalid Credentials',400);
        };

        //checj manual lock
        if(existingAdmin.lockedManually){
            throw new AppError('Account Locked',423);
        };

        if(existingAdmin.lockUntil && existingAdmin.lockUntil > new Date()){
            const wait = Math.ceil((existingAdmin.lockUntil.getTime() - Date.now()) / 60000);
            throw new AppError(`Account locked. Try again in ${wait} minute(s)`,423)
        };

        //clear expired lock 
        if(existingAdmin.lockUntil && existingAdmin.lockUntil <= new Date()){
            existingAdmin.lockUntil = null;
            existingAdmin.loginAttempts = 0;
            existingAdmin.lockLevel = 0;

            await existingAdmin.save();

        };

        const isMatch = await bcrypt.compare(password, existingAdmin.password);

        if(!isMatch){
            existingAdmin.loginAttempts += 1;
            
            if(existingAdmin.loginAttempts >= maxAttempt){
                existingAdmin.lockLevel += 1;
                existingAdmin.loginAttempts = 0
            };

            if(existingAdmin.lockLevel >= 3){
                existingAdmin.lockedManually = true;
                existingAdmin.lockUntil = null;

                const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d32f2f;">Account Locked</h2>
              <p>Hello,</p>
              <p>We noticed multiple unsuccessful login attempts on your account associated with this email address.</p>
              <p>As a result, your account has been temporarily locked for security reasons.</p>
              <p>If you believe this was a mistake or you require urgent access, please use the unlock route under the login form to unlock your account!.</p>
              <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #d32f2f;">
                <strong>Status:</strong> Locked after too many failed attempts<br>
                <strong>Next step:</strong> Contact Super Admin or wait if this is your 1st or 2nd lock.
              </div>
              <p>If this activity was not initiated by you, we recommend resetting your password after regaining access.</p>
              <p>Thank you,<br>Cup O' Cake</p>
            </div>
                `

                await sendEmail({
                    to: email,
                    subject: 'Account Locked',
                    html: html
                })

            } else if(existingAdmin.lockLevel > 0){
                const duration = lockDuration[existingAdmin.lockLevel];
                existingAdmin.lockUntil = new Date( Date.now() + duration);
            }

            await existingAdmin.save()
            throw new AppError('Invalid Credentials',400);

        }

        //password is correct - reset everything and proceed to login
        if (existingAdmin.loginAttempts > 0 || existingAdmin.lockLevel > 0) {
            existingAdmin.loginAttempts = 0;
            existingAdmin.lockLevel = 0;
            existingAdmin.lockUntil = null;
            existingAdmin.lastLogin = new Date();
            await existingAdmin.save();
        }

        jwt.sign(
            {_id: existingAdmin._id, role: existingAdmin.role},
            process.env.JWT_SECRET as string,
            {expiresIn: '1d'},
            (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    maxAge: 1 * 24 * 60 * 60 * 1000
                }).json({
                    role: existingAdmin.role,
                    adminId: existingAdmin._id,
                    name: existingAdmin.name
                })
            }
        )

    }
);


export const forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const cleanedEmail = email.trim().toLowerCase();
        const existingAdmin = await adminModel.findOne({ email: cleanedEmail });

        if(!existingAdmin){
            res.status(200).json({ message: 'If a user with this email exists, a verification code will be sent'});
            return;
        };

        const { resetToken, hashedToken } = await generateResetToken();

        existingAdmin.resetToken = hashedToken;
        existingAdmin.resetTokenExpiry = new Date(Date.now() + 1500000) ;
        await existingAdmin.save();

        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
            <h2 style="color: #FF3B30; text-align: center; margin-bottom: 10px;">Cup O' Cake</h2>
            
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">
                We received a request to reset your password.  
                Please use the verification code below to proceed:
            </p>

            <div style="text-align: center; margin: 20px 0;">
                <h1 style="font-size: 28px; letter-spacing: 4px; color: #FF3B30; margin: 0;">${resetToken}</h1>
            </div>

            <p style="font-size: 14px; color: #555; text-align: center;">
                ⏳ This code will expire in <strong>15 minutes</strong>.
            </p>

            <p style="font-size: 14px; color: #555;">
                If you did not request a password reset, please ignore this email.  
                Your account will remain secure.
            </p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #999; text-align: center;">
                &copy; ${new Date().getFullYear()} Cup O' Cake. All rights reserved.
            </p>
            </div>
        `
        await sendEmail({
            to: email,
            subject: 'Password Reset Verification Code',
            html: html
        });

        res.status(200).json({message: 'Verification code sent successfully', email: existingAdmin.email})
        
    }
);



export const resetPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, token, newPassword } = req.body;
        const cleanedEmail = email.trim().toLowerCase();

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const existingAdmin:IAdmin = await adminModel.findOne({
            email: cleanedEmail,
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        }).select('+password');

        if(!existingAdmin){
            throw new AppError('Invalid or expired verification code',400);
        };

        const salt = await bcrypt.genSalt(10);
        existingAdmin.password = await bcrypt.hash(newPassword,salt);
        existingAdmin.resetToken = undefined;
        existingAdmin.resetTokenExpiry = undefined;
        existingAdmin.tokenVersion = (existingAdmin.tokenVersion || 0) + 1;

        await existingAdmin.save();

        res.status(200).json({success: true, message: 'Password reset Successful'})

    }
);

export const requestOTP = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        const cleanedEmail = email.trim().toLowerCase();

        const existingAdmin = await adminModel.findOne({ email: cleanedEmail });

        if(!existingAdmin){
            res.status(200).json({ message: 'If a user with this email exists, an OTP will be sent'});
            return;
        };

        const { resetToken: OTP, hashedToken: hashedOTP } = await generateResetToken();

        existingAdmin.OTP = hashedOTP;
        existingAdmin.resetOTPExpiry =  new Date(Date.now() + 1500000);
        await existingAdmin.save();
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
            <h2 style="color: #FF3B30; text-align: center; margin-bottom: 10px;">Cup O' Cake</h2>
            
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">
                We received a request to unlock your account.  
                Please use the OTP below to proceed:
            </p>

            <div style="text-align: center; margin: 20px 0;">
                <h1 style="font-size: 28px; letter-spacing: 4px; color: #FF3B30; margin: 0;">${OTP}</h1>
            </div>

            <p style="font-size: 14px; color: #555; text-align: center;">
                ⏳ This code will expire in <strong>15 minutes</strong>.
            </p>

            <p style="font-size: 14px; color: #555;">
                If you did not request for an account unlock, please ignore this email.  
                Your account will remain secure.
            </p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #999; text-align: center;">
                &copy; ${new Date().getFullYear()} Cup O' Cake. All rights reserved.
            </p>
            </div>
        `

    await sendEmail({
        to: email,
        subject: 'One Time Passcode',
        html: html
    });

    res.status(200).json({message: 'OTP sent successfully', email: existingAdmin.email});
    }
);

export const unlockUser = asyncHandler(
    async(req: Request, res: Response) => {
        const { email, OTP} = req.body;
        const cleanedEmail = email.trim().toLowerCase();

        const hashedOTP = crypto.createHash('sha256').update(OTP).digest('hex');

        const existingAdmin = await adminModel.findOne({
            email: cleanedEmail,
            OTP: hashedOTP,
            resetOTPExpiry: { $gt: Date.now()}
        });

        if(!existingAdmin) {
            throw new AppError('Invalid or expired OTP code',400);

        };

        if (existingAdmin.lockLevel < 3) {
            throw new AppError('Account not locked manually so wait...',400)
        }
        
        const wasLocked = existingAdmin.lockedManually || (existingAdmin.lockUntil && existingAdmin.lockUntil > new Date());

        existingAdmin.lockedManually = false;
        existingAdmin.lockLevel = 0;
        existingAdmin.lockUntil = null,
        existingAdmin.loginAttempts = 0;

        await existingAdmin.save();
        
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
          <h2 style="color: #007AFF; text-align: center; margin-bottom: 10px;">Cup O' Cake</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">
            Your account has been unlocked. You can now log in to your account.
          </p>
          <p style="font-size: 14px; color: #555;">
            If you have any questions or concerns, please contact our support team.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            &copy; ${new Date().getFullYear()} Cup O' Cake. All rights reserved.
          </p>
        </div>
        `
        
        
        await sendEmail({
            to: existingAdmin.email,
            subject: 'Account Unlocked',
            html: html
        })

        res.status(200).json(
            {   success: true,
                message: `User account with email ${existingAdmin.email} unlocked`,
                wasLocked
        }
        )
    }
);


export const logout = asyncHandler(
    async(req: Request, res: Response) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
);
