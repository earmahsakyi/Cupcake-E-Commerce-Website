import { Request, Response } from "express";
import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllPayments = asyncHandler(
    async (req: Request, res: Response) => {
        const [payments]: any = await pool.query(
            `SELECT p.id, p.order_id, p.paystack_reference, p.amount_pesewas,
                    p.momo_network, p.phone, p.status, p.paid_at,
                    o.customer_name
             FROM payments p
             LEFT JOIN orders o ON p.order_id = o.id
             ORDER BY p.id DESC`
        );

        res.status(200).json({ success: true, data: payments });
    }
);