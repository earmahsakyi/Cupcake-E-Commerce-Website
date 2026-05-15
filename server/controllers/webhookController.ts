import pool from "../config/db.js";
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import crypto from 'crypto';
import { AppError } from "../middleware/errorHandler.js";
import { sendOrderConfirmationSMS } from "../utils/sms.js";

export const webhook = asyncHandler(
    async(req: Request, res: Response) => {
        //getting the signature from paystack headers
        const signature = req.headers['x-paystack-signature'];
        const rawBody = req.body.toString();

        const hash = crypto.
                createHmac('sha512',String(process.env.PAYSTACK_SECRET_KEY))
                .update(rawBody)
                .digest('hex');

        if(hash !== signature){
            throw new AppError('Invalid signature',401)
        };

        const event = JSON.parse(rawBody);

        if(event.event !== 'charge.success'){
            res.status(200).json();
            return;
        };

        const { reference, amount } = event.data;

        const [results]: any = await pool.query(
            `SELECT customer_name, customer_phone 
            FROM orders
            WHERE reference = ?`,
            [reference]
        );


        if (!results.length){
         res.status(200).json({ received: true })
         return
        };

        const order = results[0];

         await pool.query(
            `UPDATE payments
            SET status = 'success', paid_at = NOW()
            WHERE paystack_reference = ?`,
            [reference]
        );

        await pool.query(
            `UPDATE orders
            SET status = 'paid'
            WHERE reference = ?`,
            [reference]
        );

   
        await sendOrderConfirmationSMS(order.customer_phone, amount, order.customer_name, reference)

        res.status(200).json({received: true})
            
    }
);