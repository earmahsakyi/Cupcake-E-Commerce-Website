import { Request, Response } from "express";
import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import {  sendRawSMS } from "../utils/sms.js";

export interface SendSmsBody {
    order_id: number;
    phone: string;
    message: string;
    trigger_type: 'manual' | 'payment' | 'out_for_delivery';
}

//  POST /api/sms/send 
// Admin manually sends an SMS and logs it

export const sendSms = asyncHandler(
    async (req: Request, res: Response) => {
        const { order_id, phone, message, trigger_type } = req.body as SendSmsBody;


        const validTriggers = ['manual', 'payment', 'out_for_delivery'];
        if (!trigger_type || !validTriggers.includes(trigger_type)) {
            throw new AppError(`trigger_type must be one of: ${validTriggers.join(', ')}`, 400);
        }

        // Check order exists
        const [rows]: any = await pool.query(
            `SELECT id FROM orders WHERE id = ?`, [order_id]
        );
        if (!rows.length) throw new AppError('Order not found', 404);

        // Send the actual SMS 
        await sendRawSMS(phone, message);

        // Log it
        await pool.execute(
            `INSERT INTO sms_logs (order_id, phone, message, trigger_type, sent_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [order_id, phone.trim(), message.trim(), trigger_type]
        );

        res.status(201).json({ success: true });
    }
);

// GET /api/sms 
// Fetch all SMS logs for the admin page

export const getSmsLogs = asyncHandler(
    async (req: Request, res: Response) => {
        const [logs]: any = await pool.query(
            `SELECT sl.id, sl.order_id, sl.phone, sl.message, sl.trigger_type, sl.sent_at,
                    o.customer_name
             FROM sms_logs sl
             LEFT JOIN orders o ON sl.order_id = o.id
             ORDER BY sl.sent_at DESC`
        );

        res.status(200).json({ success: true, data: logs });
    }
);
