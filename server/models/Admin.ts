import mongoose from "mongoose";
import {IAdmin } from "../types/admin.types.js";

const adminSchema = new mongoose.Schema<IAdmin>({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true

    },
    role: {
        type: String,
        enum: ['SuperAdmin','Admin'],
        default: 'Admin'
    },
    password: {
        type: String,
        required: true,
        select: false
    },

    lastLogin: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    },
    resetToken: {
        type: String
    },
    OTP: {
        type: String
    },
    resetOTPExpiry: {
        type: Date
    },
    OTPversion: {
        type: Number,
        default: 0
    },
    resetTokenExpiry: {
        type: Date
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    loginAttempts : { type:Number, default: 0},
    lockUntil: {type:Date, default: null},
    lockLevel: {type: Number, default: 0},
    lockedManually: {type: Boolean, default: false}
},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
);


const adminModel = mongoose.models.Admin || mongoose.model<IAdmin>('Admin',adminSchema);

export default adminModel;



