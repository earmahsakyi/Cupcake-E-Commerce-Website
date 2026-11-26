import pool from "../config/db.js";
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import crypto from 'crypto';
import { AppError } from "../middleware/errorHandler.js";
import { sendOrderConfirmationSMS,sendRawSMS } from "../utils/sms.js";
import sendEmail from "../utils/sendEmail.js";
import { normalisePhone } from "../utils/helper.js";

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
            `SELECT id, customer_name, customer_phone, total_pesewas 
            FROM orders
            WHERE reference = ?`,
            [reference]
        );


        if (!results.length){
         res.status(200).json({ received: true })
         return
        };

        const [payments]: any = await pool.query(
            `SELECT status FROM payments WHERE paystack_reference = ?`,
            [reference]
        );

        if (!payments.length || payments[0].status === 'success') {
            res.status(200).json({ received: true });
            return;
        }

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
        await pool.query(
        `INSERT INTO transactions (type, amount_pesewas, description, source, order_id)
        SELECT 'revenue', total_pesewas, CONCAT('Payment for order ', reference), 'order', id
        FROM orders
        WHERE reference = ?`,
        [reference]
    );

      

        const old_amount = Number((order.total_pesewas / 100).toFixed(2))
        await sendOrderConfirmationSMS(order.customer_phone, Number(order.total_pesewas), order.customer_name, reference);
        const message = `New order ${reference} from ${order.customer_name} for GH₵${old_amount}. Please check your dashboard for details.`
        const number = process.env.MAIN_PHONE!;
        await sendRawSMS(number, message)

        // Auto-log the SMS that was just sent
        try {
            const smsMessage = `Hi ${order.customer_name}, your payment for order ${reference} was successful. We'll start preparing your order. Cup O' Cake`;
            await pool.execute(
                `INSERT INTO sms_logs (order_id, phone, message, trigger_type, sent_at)
                 VALUES (?, ?, ?, 'payment', NOW()),
                 (?, ?, ?, 'manual', NOW())`,
                [
                    order.id, order.customer_phone, smsMessage,
                    order.id, number, message

                ]
            );
        } catch (smsLogErr) {
            // Don't fail the webhook if logging fails — just log the error
            console.error('Failed to log SMS:', smsLogErr);
        }

        const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafc; padding: 20px; border-radius: 10px; max-width: 650px; margin: auto; border: 1px solid #e5e7eb;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #FF3B30; margin-bottom: 5px;">
                    🎂 New Order Received
                </h1>

                <p style="color: #666; font-size: 14px;">
                    Cup O' Cake Admin Notification
                </p>
            </div>

            <!-- Greeting -->
            <p style="font-size: 16px; color: #333;">
                Hello Sharon,
            </p>

            <p style="font-size: 16px; color: #333; line-height: 1.6;">
                A customer has successfully completed a new order and payment on the website.
            </p>

            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 12px; color: #999; text-align: center;">
                &copy; ${new Date().getFullYear()} Cup O' Cake. All rights reserved.
            </p>
            </div>
        `
        await sendEmail({
            to: process.env.BASE_EMAIL as string,
            subject: `New Order Received from ${order.customer_name}`,
            html: html
        });

        res.status(200).json({received: true})
            
    }
);