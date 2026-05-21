import { Router } from "express";
import {
    getAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from "../controllers/transactionsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

// All transaction routes are admin-protected
router.get("/", protect, getAllTransactions);
router.post(
    "/",
    protect,
    validateBody(["type", "amount_pesewas", "description"]),
    createTransaction
);
router.patch("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

export default router;