import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import pool from "../config/db.js";

// ─── GET /api/transactions\
export const getAllTransactions = asyncHandler(
    async (_req: Request, res: Response) => {
        const [rows]: any = await pool.query(
            `SELECT id, type, amount_pesewas, description, source, order_id, recorded_at
             FROM transactions
             ORDER BY recorded_at DESC`
        );

        res.status(200).json({ success: true, data: rows });
    }
);

// ─── POST /api/transactions 
export const createTransaction = asyncHandler(
    async (req: Request, res: Response) => {
        const { type, amount_pesewas, description, order_id = null } = req.body;

        if (!type || !["revenue", "expense"].includes(type)) {
            throw new AppError('type must be "revenue" or "expense"', 400);
        }
        if (!amount_pesewas || typeof amount_pesewas !== "number" || amount_pesewas <= 0) {
            throw new AppError("amount_pesewas must be a positive number", 400);
        }
        if (!description?.trim()) {
            throw new AppError("description is required", 400);
        }

        const [result]: any = await pool.execute(
            `INSERT INTO transactions (type, amount_pesewas, description, source, order_id)
             VALUES (?, ?, ?, 'manual', ?)`,
            [type, amount_pesewas, description.trim(), order_id]
        );

        res.status(201).json({ success: true, data: { id: result.insertId } });
    }
);

// ─── PATCH /api/transactions/:id 
export const updateTransaction = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        // Only manual entries may be edited
        const [rows]: any = await pool.query(
            `SELECT id, source FROM transactions WHERE id = ?`,
            [id]
        );
        if (!rows.length) throw new AppError("Transaction not found", 404);
        if (rows[0].source !== "manual") {
            throw new AppError("Only manually created transactions can be edited", 403);
        }

        const { type, amount_pesewas, description } = req.body;

        const fields: string[] = [];
        const values: any[] = [];

        if (type !== undefined) {
            if (!["revenue", "expense"].includes(type)) {
                throw new AppError('type must be "revenue" or "expense"', 400);
            }
            fields.push("type = ?");
            values.push(type);
        }
        if (amount_pesewas !== undefined) {
            if (typeof amount_pesewas !== "number" || amount_pesewas <= 0) {
                throw new AppError("amount_pesewas must be a positive number", 400);
            }
            fields.push("amount_pesewas = ?");
            values.push(amount_pesewas);
        }
        if (description !== undefined) {
            if (!description.trim()) throw new AppError("description cannot be empty", 400);
            fields.push("description = ?");
            values.push(description.trim());
        }

        if (!fields.length) throw new AppError("No fields to update", 400);

        values.push(id);
        await pool.execute(
            `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        res.status(200).json({ success: true });
    }
);

// ─── DELETE /api/transactions/:id 
export const deleteTransaction = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const [rows]: any = await pool.query(
            `SELECT id, source FROM transactions WHERE id = ?`,
            [id]
        );
        if (!rows.length) throw new AppError("Transaction not found", 404);
        if (rows[0].source !== "manual") {
            throw new AppError("Only manually created transactions can be deleted", 403);
        }

        await pool.execute(`DELETE FROM transactions WHERE id = ?`, [id]);

        res.status(200).json({ success: true });
    }
);